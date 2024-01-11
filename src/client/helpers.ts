export function showInteractMessage(label: string): void {
  AddTextEntry("CH_ALERT", `Press ~INPUT_CONTEXT~ to ${label.toLowerCase()}`);
  BeginTextCommandDisplayHelp("CH_ALERT");
  EndTextCommandDisplayHelp(0, false, false, -1);
}
