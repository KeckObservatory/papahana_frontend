import React from "react"
import { CatalogRow, Target } from "../../typings/papahana";
import {ra_dec_to_deg} from './../SelectionTool/sky-view/sky_view_util'
interface Props {
    target: Target
    selIdx: number | undefined
    setSelIdx: Function
    catalogRows: CatalogRow[]
}

const format_target_coords = (ra: string, dec: string) => {
    console.log('ra dec', ra, dec)
    const coords = ra + ' ' + dec
    return coords 
}

const add_target = (aladin: any, win: any, ra: number, dec: number) => {
    var cat = win.A.catalog({ name: 'Target', sourceSize: 18 });
    aladin.addCatalog(cat);
    const options = { popupTitle: 'Target', popupDesc: '' }
    cat.addSources([win.A.marker(ra, dec, options)]);
}

const add_catalog = (aladin: any, win: any, catalogRows: CatalogRow[]) => {
        var cat = win.A.catalog({ name: 'Catalog Stars', sourceSize: 18 });
        aladin.addCatalog(cat);

        for (let idx=0; idx<catalogRows.length; idx++ ) {
          const ra = catalogRows[idx][5]
          const dec = catalogRows[idx][6]
          const options = { popupTitle: 'Alcyone', popupDesc: '<em>Bmag:</em> 2.806<br/><em>Spectral type:</em> B7III<br/>More info <a target="_blank" href="https://simbad.u-strasbg.fr/simbad/sim-id?Ident=NAME%20ALCYONE&submit=submit">in Simbad</a>' }
          cat.addSources([win.A.marker(ra, dec, options)]);
        }
        // cat.addSources([win.A.marker(56.87115, 24.10514, { popupTitle: 'Alcyone', popupDesc: '<em>Bmag:</em> 2.806<br/><em>Spectral type:</em> B7III<br/>More info <a target="_blank" href="https://simbad.u-strasbg.fr/simbad/sim-id?Ident=NAME%20ALCYONE&submit=submit">in Simbad</a>' })]);
        // cat.addSources([win.A.marker(57.29673, 24.13671, { popupTitle: 'Pleione', popupDesc: '<em>Bmag:</em> 4.97<br/><em>Spectral type:</em> B8vne<br/>More info <a target="_blank" href="https://simbad.u-strasbg.fr/simbad/sim-id?Ident=NAME+PLEIONE&NbIdent=1">in Simbad</a>' })]);
        // cat.addSources([win.A.marker(56.58156, 23.94836, { popupTitle: 'Merope', popupDesc: '<em>Bmag:</em> 4.113<br/><em>Spectral type:</em> BVI4e<br/>More info <a target="_blank" href="https://simbad.u-strasbg.fr/simbad/sim-id?Ident=V*+V971+Tau&NbIdent=1">in Simbad</a>' })]);
        // cat.addSources([win.A.marker(56.45669, 24.36775, { popupTitle: 'Maia', popupDesc: '<em>Bmag:</em> 3.812<br/><em>Spectral type:</em> B8III<br/>More info <a target="_blank" href="https://simbad.u-strasbg.fr/simbad/sim-id?Ident=NAME+MAIA&NbIdent=1">in Simbad</a>' })]);
        // cat.addSources([win.A.marker(56.21890, 24.11334, { popupTitle: 'Electra', popupDesc: '<em>Bmag:</em> 3.612<br/><em>Spectral type:</em> B6IIIe<br/>More info <a target="_blank" href="https://simbad.u-strasbg.fr/simbad/sim-id?Ident=NAME+ELECTRA&NbIdent=1">in Simbad</a>' })]);
        // cat.addSources([win.A.marker(57.29059, 24.05342, { popupTitle: 'Atlas', popupDesc: '<em>Bmag:</em> 3.54<br/><em>Spectral type:</em> B8III<br/>More info <a target="_blank" href="https://simbad.u-strasbg.fr/simbad/sim-id?Ident=NAME+ATLAS&NbIdent=1">in Simbad</a>' })]);
}

export default function Aladin(props: Props) {

    const scriptloaded = () => {
        const win: any = window
        let ra: string = props.target.target_coord_ra;
        let dec: string = props.target.target_coord_dec;
        const raDeg = ra_dec_to_deg(ra)
        const decDeg = ra_dec_to_deg(dec)
        const coords = format_target_coords(ra, dec)

        const params = {target: coords, survey: 'P/DSS2/color', zoom: 2, showReticle: true}
        let  aladin = win.A.aladin('#aladin-lite-div', params);

        add_target(aladin, win, raDeg, decDeg)
        add_catalog(aladin, win, props.catalogRows)
        const url = 'https://irsa.ipac.caltech.edu/cgi-bin/Gator/nph-query?catalog=allwise_p3as_psd&spatial=cone&radius=300&radunits=arcsec&objstr=00h+42m+44.32s+41d+16m+08.5s&size=300&outfmt=3&selcols=ra,dec,w1mpro,w2mpro,w3mpro,w4mpro'
        win.A.catalogFromURL(url)

    }

    React.useEffect(() => {
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
    }, [props.target.target_coord_ra, props.target.target_coord_dec])


    return (
        <div id='aladin-lite-div' style={{ width: '600px', height: '600px' }} />
    )
}