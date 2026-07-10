export function recordBelongsToElder(recordElderUserId: string | undefined, elderUserId: string | undefined) {
  return Boolean(recordElderUserId && elderUserId && recordElderUserId === elderUserId);
}
