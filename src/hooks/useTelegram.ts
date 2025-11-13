export function useTelegram() {
  const tg = window.Telegram.WebApp

  const onClose = () => {
    tg.close()
  }

  const toggleMainButton = () => {
    if (tg.MainButton.isVisible) {
      tg.MainButton.hide()
    } else {
      tg.MainButton.show()
    }
  }

  return {
    tg,
    onClose,
    toggleMainButton,
    user: tg.initDataUnsafe?.user,
    queryId: tg.initDataUnsafe?.query_id,
  }
}
