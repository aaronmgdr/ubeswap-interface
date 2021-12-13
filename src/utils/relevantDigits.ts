import { TokenAmount } from '@ubeswap/sdk'

export function relevantDigits(tokenAmount?: TokenAmount) {
  if (!tokenAmount || tokenAmount.equalTo('0')) {
    return '0.0000'
  }

  if (tokenAmount.lessThan('0.0001')) {
    return '< 0.0001'
  }

  if (tokenAmount.lessThan('1')) {
    return tokenAmount.toSignificant(4)
  }

  if (tokenAmount.lessThan('100')) {
    return tokenAmount.toFixed(2)
  }

  return tokenAmount.toFixed(0, { groupSeparator: ',' })
}
