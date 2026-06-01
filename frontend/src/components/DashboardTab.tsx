import { useEffect, useState } from 'react';
import { Box, Card, CardContent, CircularProgress, Grid, Tooltip, Typography } from '@mui/material';
import { api } from '../api/client';
import { COLORS } from '../constants/themeColors';
import { STIX_TYPES } from '../constants/stixTypes';
import MostActiveThreats from './MostActiveThreats';
import MostActiveMalware from './MostActiveMalware';

interface Props {
  onTypeClick: (type: string) => void;
}

export default function DashboardTab({ onTypeClick }: Props) {
  const [counts, setCounts] = useState<Record<string, number | string>>({});
  const [relationships, setRelationships] = useState<import('../api/client').StixObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      Promise.all(
        STIX_TYPES.map(t =>
          api.stix(t.key, 1000).then(objs => [t.key, objs.length === 1000 ? '1000+' : objs.length] as const)
        )
      ),
      api.stix('relationship', 1000),
    ])
      .then(([entries, rels]) => {
        setCounts(Object.fromEntries(entries));
        setRelationships(rels);
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress sx={{ color: COLORS.accentSecondary }} /></Box>;
  if (error) return <Typography color="error" sx={{ fontFamily: 'monospace' }}>Failed to load: {error}</Typography>;

  const countValues = Object.values(counts);
  const total = countValues.reduce<number>((a, b) => a + (typeof b === 'number' ? b : 1000), 0);
  const totalLabel = countValues.some(v => v === '1000+') ? `${total}+` : String(total);

  return (
    <Box>
      <Typography variant="body2" sx={{ color: COLORS.textMuted, mb: 3, fontFamily: 'monospace' }}>
        {totalLabel} objects across {STIX_TYPES.length} key types
      </Typography>
      <Grid container spacing={2}>
        {STIX_TYPES.map(t => (
          <Grid item xs={6} sm={4} md={3} key={t.key}>
            <Card
              onClick={() => onTypeClick(t.key)}
              sx={{
                background: 'linear-gradient(105deg, #402e68 0%, #7f5bce 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 2,
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(127,91,206,0.4)',
                },
              }}
            >
              <Tooltip title={t.def} placement="top" arrow>
                <Typography
                  onClick={e => e.stopPropagation()}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.6rem',
                    bgcolor: 'rgba(255,255,255,0.12)',
                    borderRadius: '50%',
                    width: 15,
                    height: 15,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'help',
                    fontFamily: 'monospace',
                    userSelect: 'none',
                  }}
                >?</Typography>
              </Tooltip>
              <CardContent>
                <Typography variant="h4" sx={{ color: COLORS.textPrimary, fontWeight: 'bold', fontFamily: 'monospace' }}>
                  {counts[t.key]}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'monospace', letterSpacing: 0.5, mt: 0.5 }}>
                  {t.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="h6" sx={{ color: COLORS.textColor, fontWeight: 'bold' }}>
              MOST ACTIVE THREATS
            </Typography>
            <Tooltip
              title="Threat actors and intrusion sets ranked by how many STIX relationship objects reference them. A relationship connects two STIX objects — for example, 'Lazarus Group uses Cobalt Strike' or 'APT29 targets Finance'. The more relationships an entity appears in, the more documented activity it has."
              placement="right"
              arrow
            >
              <Typography sx={{
                color: COLORS.textMuted,
                fontSize: '0.7rem',
                bgcolor: 'rgba(255,255,255,0.07)',
                borderRadius: '50%',
                width: 18,
                height: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'help',
                flexShrink: 0,
                fontFamily: 'monospace',
                userSelect: 'none',
              }}>?</Typography>
            </Tooltip>
          </Box>
          <MostActiveThreats relationships={relationships} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="h6" sx={{ color: COLORS.textColor, fontWeight: 'bold' }}>
              MOST ACTIVE MALWARE
            </Typography>
            <Tooltip
              title="Malware families ranked by how many STIX relationships reference them. Each ring represents one malware family — the longer the arc, the more it appears across threat intelligence reports. Useful for spotting which malware is most commonly linked to attacks in your feeds."
              placement="right"
              arrow
            >
              <Typography sx={{
                color: COLORS.textMuted,
                fontSize: '0.7rem',
                bgcolor: 'rgba(255,255,255,0.07)',
                borderRadius: '50%',
                width: 18,
                height: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'help',
                flexShrink: 0,
                fontFamily: 'monospace',
                userSelect: 'none',
              }}>?</Typography>
            </Tooltip>
          </Box>
          <MostActiveMalware relationships={relationships} />
        </Grid>
      </Grid>
    </Box>
  );
}
