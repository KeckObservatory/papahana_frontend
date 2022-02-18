import React from 'react';
import LaunchIcon from '@mui/icons-material/Launch';
import Tooltip from '@mui/material/Tooltip'
import { IconButton } from '@mui/material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Aladin from './aladin'
import TemplateForm from '../forms/template_form';
import { OBComponent, Target } from './../../typings/papahana';
import CatalogTable from './catalog_table';
import { mockCatalog } from "./../../mocks/catalog"

interface Props {
  id: string
  obComponent: OBComponent
  updateOB: Function;
}

export const TargetResolverDialog = (props: Props) => {

  const [open, setOpen] = React.useState(false)
  const [selIdx, setSelIdx] = React.useState(undefined as number | undefined)
  const [catalog, setCatalog] = React.useState(mockCatalog)
  const [filtCatalog, setFiltCatalog] = React.useState(mockCatalog)

  const launch_target_resolver = (evt: any) => {
    console.log('target resolver blastoff!!!')
    setOpen(true)
  }

  const close_target_resolver = () => {
    setOpen(false);
  };
  return (
    <div>
      <Tooltip title="Launch Image resolver">
        <IconButton aria-label='launch' onClick={launch_target_resolver}>
          <LaunchIcon />
        </IconButton>
      </Tooltip>
      <Dialog maxWidth={'xl'} open={open} onClose={close_target_resolver}>
        <DialogTitle>Target Resolver</DialogTitle>
        <DialogContent >
          <div style={{ display: 'flex' }}>
            <div style={{ width: '250px', margin: '5px', padding: '5px' }}>
              <TemplateForm id={props.id} obComponent={props.obComponent} updateOB={props.updateOB} />
            </div>
            <Aladin
              selIdx={selIdx}
              setSelIdx={setSelIdx}
              catalogRows={catalog}
              target={props.obComponent as Target} />
            <div style={{ width: '500px', margin: '5px', padding: '5px' }}>
              <CatalogTable 
                rows={filtCatalog}
                setFiltCatalog={setFiltCatalog}
                selIdx={selIdx}
                setSelIdx={setSelIdx} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  )
}
