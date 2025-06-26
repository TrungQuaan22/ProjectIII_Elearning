declare module 'vnpay' {
  interface VNPayConfig {
    tmnCode: string
    secureSecret: string
    vnpayHost: string
    queryDrAndRefundHost?: string
    testMode?: boolean
    hashAlgorithm?: 'SHA256' | 'SHA512'
    enableLog?: boolean
    loggerFn?: (message: string) => void
    endpoints?: {
      paymentEndpoint?: string
      queryDrRefundEndpoint?: string
      getBankListEndpoint?: string
    }
  }

  interface PaymentUrlParams {
    vnp_Amount: number
    vnp_Command: string
    vnp_CreateDate: string
    vnp_CurrCode: string
    vnp_IpAddr: string
    vnp_Locale: string
    vnp_OrderInfo: string
    vnp_OrderType: string
    vnp_ReturnUrl: string
    vnp_TmnCode: string
    vnp_TxnRef: string
    vnp_Version: string
  }

  export class VNPay {
    constructor(config: VNPayConfig)
    buildPaymentUrl(params: PaymentUrlParams): Promise<string>
    verifyReturnUrl(params: PaymentUrlParams): Promise<boolean>
  }

  export function ignoreLogger(message: string): void
}
