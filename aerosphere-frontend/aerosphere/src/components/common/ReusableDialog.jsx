import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Slide } from '@mui/material';
import { forwardRef } from 'react';
import { FiX } from 'react-icons/fi';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ReusableDialog({ open, onClose, title, children, actions, maxWidth = 'sm' }) {
  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} maxWidth={maxWidth} fullWidth
      PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        {title}
        <IconButton onClick={onClose} size="small"><FiX /></IconButton>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      {actions && <DialogActions sx={{ p: 2 }}>{actions}</DialogActions>}
    </Dialog>
  );
}
