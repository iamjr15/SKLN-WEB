export default function({ store, redirect }) {
  if (!store.getters.GET_LOGIN_STATE) {
    return redirect('/')
  }
}
