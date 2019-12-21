export default function({ store, redirect }) {
  if (
    !store.getters.GET_LOGIN_STATE ||
    store.getters.GET_USER_ROLE !== 'teacher'
  ) {
    return redirect('/')
  }
}
