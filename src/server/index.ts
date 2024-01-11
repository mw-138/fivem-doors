import { Doors } from "./doors";
import Door from "@common/door";
import { DoorState } from "@common/doorState";

function getDoorFromId(id: string): Door {
  return Doors.find((door) => door.id === id);
}

onNet("doors:fetch", () => {
  emitNet("doors:update", source, Doors);
});

onNet("doors:setLockState", (id: string, state: boolean) => {
  const door = getDoorFromId(id);
  if (door === undefined) {
    return;
  }
  door.isLocked = !door.isLocked;
  getPlayers().forEach((player) => {
    emitNet(
      "doors:setLockState",
      player,
      id,
      door.isLocked ? DoorState.LOCKED : DoorState.UNLOCKED
    );
    emitNet("doors:update", player, Doors);
  });
});
