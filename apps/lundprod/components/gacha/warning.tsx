import { Box, Text } from "@chakra-ui/react"
import { useTranslation } from "react-i18next"

export const Warning = () => {
  const {t} = useTranslation()

  return (
    <Box p="20px" background="#faa5a5" border="1px solid" borderColor={"#CC3333"} textAlign="center">
      <Text fontWeight={700} color="#333">{t('gacha.warning')}</Text>
    </Box>
  )
}
