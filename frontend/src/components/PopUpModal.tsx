import { useEffect, useState } from 'react';
import { Box, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { api, type StixObject } from '../api/client';
import { COLORS } from '../constants/themeColors';
import ErrorDisplay from './ErrorDisplay';

interface Props {
    stixId: string | null;
    onClose: () => void;
}

export default function PopUpModal({ stixId, onClose }: Props) {
    const [stix, setStix] = useState<StixObject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!stixId) return;

        const controller = new AbortController();

        api.stixById(stixId, controller.signal)
            .then(setStix)
            .catch(e => {
                if (e.name === 'AbortError') return;
                setError(String(e));
            })
            .finally(() => setLoading(false));

        return () => controller.abort();

    }, [stixId]); 


    const props = stix?.properties || {};
    const displayName = (props.name as string) || stix?.stix_id || 'Unnamed Threat Intel Profile';
    const description = (props.description as string) || 'No deep analytical description found inside this payload document.';
    const aliases = Array.isArray(props.aliases) ? (props.aliases as string[]) : [];

    return (
        <Dialog 
            open={!!stixId} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: COLORS.headerBackground ?? '#1e1e24',
                    color: COLORS.textPrimary ?? '#fff',
                    borderRadius: 2,
                    border: '1px solid ${COLORS.dataContainerBorder ?? "rgba(255,255,255,0.07)"}',
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography variant="subtitle2" sx={{ color: COLORS.textMuted, fontFamily: 'monospace', textTransform: 'uppercase' }}>
                    Threat Intel Profile
                </Typography>
                <IconButton onClick={onClose} sx={{ color: COLORS.textMuted }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            
            <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress sx={{ color: COLORS.textQuaternary }} />
                    </Box>
                )}
                
                {error && <ErrorDisplay message={error} />}
                
                {!loading && !error && stix && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        
                        {/* Title Block using properties.name */}
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {displayName}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip 
                                    label={stix.type} 
                                    size="small" 
                                    sx={{ bgcolor: COLORS.textQuaternary, color: '#fff', fontSize: '0.75rem', fontWeight: 'bold' }} 
                                />
                            </Box>
                        </Box>

                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

                        {/* Aliases mapping array safely from nested JSON */}
                        {aliases.length > 0 && (
                            <Box>
                                <Typography variant="caption" sx={{ color: COLORS.textMuted, display: 'block', mb: 0.5 }}>
                                    TRACKED ALIASES
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                    {aliases.map((alias) => (
                                        <Chip key={alias} label={alias} size="small" variant="outlined" sx={{ color: COLORS.textPrimary, borderColor: 'rgba(255,255,255,0.1)' }} />
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {/* Description using properties.description */}
                        <Box>
                            <Typography variant="caption" sx={{ color: COLORS.textMuted, display: 'block', mb: 0.5 }}>
                                DESCRIPTION / BEHAVIORAL OVERVIEW
                            </Typography>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: 'rgba(255,255,255,0.8)', 
                                    lineHeight: 1.6,
                                    bgcolor: 'rgba(0,0,0,0.15)',
                                    p: 1.5,
                                    borderRadius: 1,
                                    whiteSpace: 'pre-wrap'
                                }}
                            >
                                {description}
                            </Typography>
                        </Box>

                        {/* Timing columns based on table values */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, bgcolor: 'rgba(255,255,255,0.02)', p: 1.5, borderRadius: 1 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: COLORS.textMuted, display: 'block' }}>First Observed</Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                    {stix.stix_created ? new Date(stix.stix_created).toLocaleDateString() : 'Unknown'}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: COLORS.textMuted, display: 'block' }}>Last Updated</Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                    {stix.stix_modified ? new Date(stix.stix_modified).toLocaleDateString() : 'N/A'}
                                </Typography>
                            </Box>
                        </Box>

                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}