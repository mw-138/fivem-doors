import Door from "@common/door";
import { DoorState } from "@common/doorState";
import { showInteractMessage } from "./helpers";
import { delay } from "@common/index";

let doorList: Door[] = [];

on("onClientResourceStart", (name: string) => {
  if (name != GetCurrentResourceName()) return;

  fetchDoors();
});

function fetchDoors(): void {
  emitNet("doors:fetch", -1);
}

onNet("doors:update", (doors: Door[]) => {
  doorList = doors;
  doorList.forEach((door) => {
    if (!IsDoorRegisteredWithSystem(door.hash)) {
      const [x, y, z] = door.coords;
      AddDoorToSystem(door.id, door.hash, x, y, z, false, false, false);
      emit("doors:setOpenRatio", door.id, 0);
      emit(
        "doors:setSystemDoorState",
        door.id,
        door.isLocked ? DoorState.LOCKED : DoorState.UNLOCKED
      );
    }
  });
});

on("doors:setOpenRatio", (id: string, ajar: number) => {
  DoorSystemSetOpenRatio(id, ajar, false, false);
});

on("doors:setSystemDoorState", (id: string, state: DoorState) => {
  DoorSystemSetDoorState(id, state, false, false);
});

function getNearestDoor(): [boolean, Door | undefined] {
  const [x, y, z] = GetEntityCoords(PlayerPedId(), false);
  function predicate(value: Door, index: number) {
    const [ox, oy, oz] = value.coords;
    const dist = Vdist(x, y, z, ox, oy, oz);
    return dist < value.maxDist;
  }
  const nearDoor = doorList.some(predicate);
  const nearestDoor = doorList.find(predicate);
  return [nearDoor, nearestDoor];
}

async function playDoorAnim(): Promise<void> {
  const dict = "anim@heists@keycard@";
  const anim = "exit";
  const doOnlyUpperAnim = true;
  const ped = PlayerPedId();
  ClearPedSecondaryTask(ped);
  RequestAnimDict(dict);
  while (!HasAnimDictLoaded(dict)) {
    await delay(0);
  }
  TaskPlayAnim(
    ped,
    dict,
    anim,
    8,
    1,
    300,
    doOnlyUpperAnim ? 49 : 16,
    0,
    false,
    false,
    false
  );
}

setTick(() => {
  const [isNearDoor, nearestDoor] = getNearestDoor();
  if (isNearDoor) {
    if (nearestDoor.showPrompt) {
      showInteractMessage(`${nearestDoor.isLocked ? "Unlock" : "Lock"} Door`);
    }
    if (IsControlJustReleased(0, 38)) {
      playDoorAnim();
      emitNet("doors:setLockState", nearestDoor.id, !nearestDoor.isLocked);
    }
  }
});
