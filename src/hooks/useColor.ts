import * as UbeswapDefaultList from '@ubeswap/default-token-list'
import * as UbeswapExperimentalList from '@ubeswap/default-token-list/ubeswap-experimental.token-list.json'
import { ChainId, Token } from '@ubeswap/sdk'
import Vibrant from 'node-vibrant'
import { shade } from 'polished'
import { useLayoutEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import uriToHttp from 'utils/uriToHttp'
import { hex } from 'wcag-contrast'

const images: Record<string, string> = {}

UbeswapDefaultList.tokens.concat(UbeswapExperimentalList.tokens).forEach((token) => {
  images[token.address] = token.logoURI
})

async function getColorFromToken({ address, chainId }: { address: string; chainId: number }): Promise<string | null> {
  if (chainId === ChainId.ALFAJORES && address === '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735') {
    return Promise.resolve('#FAAB14')
  }

  const path = images[address]
  if (!path) {
    return '#FAAB14'
  }

  return Vibrant.from(path)
    .getPalette()
    .then((palette) => {
      if (palette?.Vibrant) {
        let detectedHex = palette.Vibrant.hex
        let AAscore = hex(detectedHex, '#FFF')
        while (AAscore < 3) {
          detectedHex = shade(0.005, detectedHex)
          AAscore = hex(detectedHex, '#FFF')
        }
        return detectedHex
      }
      return null
    })
    .catch(() => null)
}

async function getColorFromUriPath(uri: string): Promise<string | null> {
  const formattedPath = uriToHttp(uri)[0]

  return Vibrant.from(formattedPath)
    .getPalette()
    .then((palette) => {
      if (palette?.Vibrant) {
        return palette.Vibrant.hex
      }
      return null
    })
    .catch(() => null)
}

export function useColor(token?: Token) {
  const theme = useTheme()
  const [color, setColor] = useState(theme.primary1)
  const chainId = token?.chainId
  const address = token?.address
  useLayoutEffect(() => {
    if (chainId && address) {
      getColorFromToken({ chainId, address }).then((tokenColor) => {
        if (tokenColor !== null) {
          setColor(tokenColor)
        }
      })
    }
  }, [chainId, address])

  return color
}

export function useListColor(listImageUri?: string) {
  const [color, setColor] = useState('#2172E5')

  useLayoutEffect(() => {
    let stale = false

    if (listImageUri) {
      getColorFromUriPath(listImageUri).then((color) => {
        if (!stale && color !== null) {
          setColor(color)
        }
      })
    }

    return () => {
      stale = true
      setColor('#2172E5')
    }
  }, [listImageUri])

  return color
}
