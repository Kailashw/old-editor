
export function getChallenges() {
  const challenges = fetch(`${process.env.API_HOST}/Documents`).then(res => {
    return res.json()
  }).then(res => {
    return res
  })
  return {type: "GET_CHALLENGES", payload: challenges}
}


export function updateDocument(payload) {
  const document = fetch(`${process.env.API_HOST}/Documents/`+payload.id, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
    method: 'PUT',
    body: JSON.stringify({
      "updatedAt": new Date().toISOString(),
      "isLocked":false,
      "updatedBy": payload.currentUser,
      "editorHtml":payload.data
    })
  })
  return {type: "UPDATE_CHALLENGES", payload: document}
}