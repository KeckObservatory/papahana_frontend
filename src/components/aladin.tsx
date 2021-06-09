import React from "react"
import { setSyntheticTrailingComments } from "typescript"

interface Props {

}
export default function Aladin(props: Props)  {

    const scriptloaded = () => {
        console.log('script loaded. setting aladin')
        const win: any = window
        console.log(window)
        const initOptions = {
            survey: 'P/DSS2/color',
            fov: 60,
            showSimbadPointerControl: true
        }
        let aladin = win.A.aladin('#aladin-lite-div', { survey: 'P/DSS2/color', fov:60 })
        aladin.setFov(1)
    }

    React.useEffect( () => {
      const aladinStyle = document.createElement('link')
      aladinStyle.href = "https://aladin.u-strasbg.fr/AladinLite/api/v2/latest/aladin.min.css"
      aladinStyle.rel = 'stylesheet'
      aladinStyle.type = 'text/css'
      document.head.appendChild(aladinStyle)
      const jqScript = document.createElement("script")
      jqScript.src = "https://code.jquery.com/jquery-1.12.1.min.js"
      jqScript.async = true
      document.body.appendChild(jqScript)
      console.log('generating aladin window')
      const script = document.createElement("script")
      script.src = "https://aladin.u-strasbg.fr/AladinLite/api/v2/latest/aladin.min.js"
      script.async = true
      script.onload = scriptloaded 

      document.body.appendChild(script)
    }, [])


    return (
        <div id='aladin-lite-div' style={{ width: '400px', height: '400px' }} />
    )
}