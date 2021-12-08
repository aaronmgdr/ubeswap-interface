import { TokenAmount } from '@ubeswap/sdk'

export function relevantDigits(tokenAmount?: TokenAmount) {
  if (!tokenAmount) {
    return '0.00'
  }
  if (tokenAmount.lessThan('1')) {
    return tokenAmount.toSignificant(6)
  }

  if (tokenAmount.lessThan('10')) {
    return tokenAmount.toSignificant(2)
  }

  return tokenAmount.toFixed(2)
}
