import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { api } from '../api/client';
import type { StixObject, StixRelationships, StixRelationshipRef, StixRelationshipBackRef } from '../api/client';
import { COLORS } from '../constants/themeColors';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import StixDescription from './StixDescription';

interface Props {
  stixId: string;
}

// Properties that are rendered explicitly above the accordion.
// Everything else in `properties` falls into "Additional Properties".
const KNOWN_KEYS = new Set([
  'name', 'description', 'aliases', 'labels',
  'first_seen', 'last_seen', 'valid_from', 'valid_until',
  'created', 'modified',
  'kill_chain_phases', 'external_references',
  'pattern', 'pattern_type',
  'relationship_type', 'source_ref', 'target_ref',
  'type', 'id', 'spec_version',
  'object_marking_refs', 'granular_markings', 'extensions',
]);

function formatDate(d: string | null | undefined): string {
  if (!d) return '—';
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? d : parsed.toLocaleString();
}

function formatDateShort(d: string | null | undefined): string {
  if (!d) return '—';
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? d : parsed.toLocaleDateString();
}

// ── Shared style helpers ──────────────────────────────────────────────────────

const sectionLabel = {
  color: COLORS.textMuted,
  fontFamily: 'monospace',
  fontSize: '0.7rem',
  letterSpacing: 1.5,
  textTransform: 'uppercase' as const,
  mb: 0.75,
};

const tableHeadCell = {
  color: COLORS.textQuaternary,
  fontFamily: 'monospace',
  fontSize: '0.7rem',
  fontWeight: 'bold',
  letterSpacing: 1,
  textTransform: 'uppercase' as const,
  borderBottom: `1px solid ${COLORS.dataContainerBorder}`,
};

const tableBodyCell = {
  borderBottom: `1px solid ${COLORS.dataContainerBorder}`,
  fontSize: '0.8rem',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
      <Typography sx={sectionLabel}>{label}</Typography>
      <Typography sx={{ color: COLORS.textPrimary, fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all' }}>
        {value}
      </Typography>
    </Box>
  );
}

interface KillChainPhase {
  kill_chain_name: string;
  phase_name: string;
}

interface ExternalReference {
  source_name?: string;
  external_id?: string;
  url?: string;
  description?: string;
}

function KillChainTable({ phases }: { phases: KillChainPhase[] }) {
  return (
    <Box>
      <Typography sx={sectionLabel}>Kill Chain Phases</Typography>
      <TableContainer component={Paper} sx={{ bgcolor: COLORS.headerBackground, border: `1px solid ${COLORS.dataContainerBorder}`, borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeadCell}>Kill Chain</TableCell>
              <TableCell sx={tableHeadCell}>Phase</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {phases.map((p, i) => (
              <TableRow key={i}>
                <TableCell sx={{ ...tableBodyCell, color: COLORS.textMuted, fontFamily: 'monospace' }}>{p.kill_chain_name}</TableCell>
                <TableCell sx={{ ...tableBodyCell, color: COLORS.textPrimary }}>{p.phase_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function ExternalRefsTable({ refs }: { refs: ExternalReference[] }) {
  return (
    <Box>
      <Typography sx={sectionLabel}>External References</Typography>
      <TableContainer component={Paper} sx={{ bgcolor: COLORS.headerBackground, border: `1px solid ${COLORS.dataContainerBorder}`, borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeadCell}>Source</TableCell>
              <TableCell sx={tableHeadCell}>ID</TableCell>
              <TableCell sx={tableHeadCell}>URL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {refs.map((r, i) => (
              <TableRow key={i}>
                <TableCell sx={{ ...tableBodyCell, color: COLORS.textPrimary }}>{r.source_name ?? '—'}</TableCell>
                <TableCell sx={{ ...tableBodyCell, color: COLORS.textMuted, fontFamily: 'monospace', fontSize: '0.75rem' }}>{r.external_id ?? '—'}</TableCell>
                <TableCell sx={tableBodyCell}>
                  {r.url
                    ? <Link href={r.url} target="_blank" rel="noopener noreferrer" sx={{ color: COLORS.textTertiary, fontSize: '0.75rem', wordBreak: 'break-all' }}>{r.url}</Link>
                    : <Typography component="span" sx={{ color: COLORS.textMuted, fontSize: '0.75rem' }}>—</Typography>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function RelationshipTable({
  title,
  rows,
  navigate,
}: {
  title: string;
  rows: (StixRelationshipRef | StixRelationshipBackRef)[];
  navigate: (path: string) => void;
}) {
  const isRef = (r: StixRelationshipRef | StixRelationshipBackRef): r is StixRelationshipRef =>
    'target_ref' in r;

  return (
    <Box>
      <Typography sx={sectionLabel}>{title}</Typography>
      <TableContainer component={Paper} sx={{ bgcolor: COLORS.headerBackground, border: `1px solid ${COLORS.dataContainerBorder}`, borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeadCell}>Relationship</TableCell>
              <TableCell sx={tableHeadCell}>Type</TableCell>
              <TableCell sx={tableHeadCell}>Name / ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} sx={{ ...tableBodyCell, color: COLORS.textMuted, fontFamily: 'monospace', textAlign: 'center', py: 2 }}>
                  No relationships
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r, i) => {
                const ref = isRef(r) ? r.target_ref : r.source_ref;
                const name = isRef(r) ? r.target_name : r.source_name;
                const type = isRef(r) ? r.target_type : r.source_type;
                return (
                  <TableRow
                    key={i}
                    onClick={() => navigate('/stix/' + encodeURIComponent(ref))}
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: COLORS.cardBackground } }}
                  >
                    <TableCell sx={{ ...tableBodyCell, color: COLORS.textQuaternary, fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {r.relationship_type}
                    </TableCell>
                    <TableCell sx={{ ...tableBodyCell, color: COLORS.textMuted, fontFamily: 'monospace', fontSize: '0.72rem' }}>
                      {type}
                    </TableCell>
                    <TableCell sx={{ ...tableBodyCell, color: COLORS.textPrimary }}>
                      {name ?? <Typography component="span" sx={{ color: COLORS.textMuted, fontFamily: 'monospace', fontSize: '0.75rem' }}>{ref}</Typography>}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function StixObjectDetail({ stixId }: Props) {
  const navigate = useNavigate();

  const [stix, setStix] = useState<StixObject | null>(null);
  const [rels, setRels] = useState<StixRelationships | null>(null);
  const [objectError, setObjectError] = useState<string | null>(null);
  const [relsError, setRelsError] = useState<string | null>(null);
  const [objectLoading, setObjectLoading] = useState(true);
  const [relsLoading, setRelsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setObjectLoading(true);
    setRelsLoading(true);
    setObjectError(null);
    setRelsError(null);
    setStix(null);
    setRels(null);

    api.stixById(stixId, controller.signal)
      .then(setStix)
      .catch(e => { if (e.name !== 'AbortError') setObjectError(String(e)); })
      .finally(() => setObjectLoading(false));

    api.stixRelationships(stixId, controller.signal)
      .then(setRels)
      .catch(e => { if (e.name !== 'AbortError') setRelsError(String(e)); })
      .finally(() => setRelsLoading(false));

    return () => controller.abort();
  }, [stixId]);

  // ── Derive display values ─────────────────────────────────────────────────

  const props = (stix?.properties ?? {}) as Record<string, unknown>;
  const displayName = (props.name as string | undefined) ?? stixId;
  const description = props.description as string | undefined;
  const aliases = Array.isArray(props.aliases) ? (props.aliases as string[]) : [];
  const labels = Array.isArray(props.labels) ? (props.labels as string[]) : [];
  const firstSeen = props.first_seen as string | undefined;
  const lastSeen = props.last_seen as string | undefined;
  const validFrom = props.valid_from as string | undefined;
  const validUntil = props.valid_until as string | undefined;
  const killChainPhases = Array.isArray(props.kill_chain_phases)
    ? (props.kill_chain_phases as KillChainPhase[])
    : [];
  const externalRefs = Array.isArray(props.external_references)
    ? (props.external_references as ExternalReference[])
    : [];
  const pattern = props.pattern as string | undefined;
  const patternType = props.pattern_type as string | undefined;

  // Collect unknown extra keys for the accordion
  const extraEntries = Object.entries(props).filter(([k]) => !KNOWN_KEYS.has(k));

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Back button */}
      <Box>
        <Button
          onClick={() => navigate('/stix')}
          sx={{
            color: COLORS.textMuted,
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            letterSpacing: 1,
            textTransform: 'uppercase',
            pl: 0,
            '&:hover': { color: COLORS.textPrimary, bgcolor: 'transparent' },
          }}
          disableRipple
        >
          ← Back to STIX Objects
        </Button>
      </Box>

      {objectLoading && <LoadingSpinner />}
      {objectError && <ErrorDisplay message={objectError} />}

      {!objectLoading && !objectError && stix && (
        <>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: COLORS.textPrimary, flex: 1, minWidth: 0, wordBreak: 'break-word' }}>
              {displayName}
            </Typography>
            <Chip
              label={stix.type}
              size="small"
              sx={{ bgcolor: COLORS.textQuaternary, color: COLORS.backgroundDefault, fontWeight: 'bold', fontSize: '0.75rem', flexShrink: 0 }}
            />
          </Box>

          <Divider sx={{ borderColor: COLORS.dataContainerBorder }} />

          {/* Meta grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <MetaRow label="STIX ID" value={stix.stix_id} />
            <MetaRow label="Feed ID" value={stix.feed_id ?? '—'} />
            <MetaRow label="Ingested At" value={formatDate(stix.ingested_at)} />
            <MetaRow label="STIX Created" value={formatDate(stix.stix_created)} />
            <MetaRow label="STIX Modified" value={formatDate(stix.stix_modified)} />
          </Box>

          {/* Description */}
          {description && (
            <Box>
              <Typography sx={sectionLabel}>Description</Typography>
              <Typography component="div" sx={{ color: COLORS.textPrimary, fontSize: '0.875rem', lineHeight: 1.6 }}>
                <StixDescription text={description} />
              </Typography>
            </Box>
          )}

          {/* Aliases */}
          {aliases.length > 0 && (
            <Box>
              <Typography sx={sectionLabel}>Tracked Aliases</Typography>
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                {aliases.map(a => (
                  <Chip key={a} label={a} size="small" variant="outlined"
                    sx={{ color: COLORS.textPrimary, borderColor: COLORS.dataContainerBorderHover }} />
                ))}
              </Box>
            </Box>
          )}

          {/* Labels */}
          {labels.length > 0 && (
            <Box>
              <Typography sx={sectionLabel}>Labels</Typography>
              <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                {labels.map(l => (
                  <Chip key={l} label={l} size="small"
                    sx={{ bgcolor: COLORS.cardBackground, color: COLORS.textQuaternary, border: `1px solid ${COLORS.cardBorder}`, fontSize: '0.72rem' }} />
                ))}
              </Box>
            </Box>
          )}

          {/* Date range (campaign / indicator) */}
          {(firstSeen || lastSeen || validFrom || validUntil) && (
            <Box>
              <Typography sx={sectionLabel}>{firstSeen || lastSeen ? 'Activity Window' : 'Valid Window'}</Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {(firstSeen || validFrom) && (
                  <Box>
                    <Typography sx={{ color: COLORS.textMuted, fontSize: '0.7rem', fontFamily: 'monospace' }}>
                      {firstSeen ? 'First Seen' : 'Valid From'}
                    </Typography>
                    <Typography sx={{ color: COLORS.textPrimary, fontSize: '0.85rem' }}>
                      {formatDateShort(firstSeen ?? validFrom)}
                    </Typography>
                  </Box>
                )}
                {(lastSeen || validUntil) && (
                  <Box>
                    <Typography sx={{ color: COLORS.textMuted, fontSize: '0.7rem', fontFamily: 'monospace' }}>
                      {lastSeen ? 'Last Seen' : 'Valid Until'}
                    </Typography>
                    <Typography sx={{ color: COLORS.textPrimary, fontSize: '0.85rem' }}>
                      {formatDateShort(lastSeen ?? validUntil)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* Kill Chain Phases */}
          {killChainPhases.length > 0 && <KillChainTable phases={killChainPhases} />}

          {/* External References */}
          {externalRefs.length > 0 && <ExternalRefsTable refs={externalRefs} />}

          {/* Pattern (indicator) */}
          {pattern && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                <Typography sx={sectionLabel}>Pattern</Typography>
                {patternType && (
                  <Chip label={patternType} size="small"
                    sx={{ bgcolor: 'transparent', color: COLORS.textMuted, border: `1px solid ${COLORS.dataContainerBorder}`, fontSize: '0.65rem', fontFamily: 'monospace', height: 18 }} />
                )}
              </Box>
              <Box sx={{
                bgcolor: COLORS.backgroundDefault,
                border: `1px solid ${COLORS.dataContainerBorder}`,
                borderRadius: 1,
                p: 1.5,
                overflowX: 'auto',
              }}>
                <Typography component="pre" sx={{ color: COLORS.textTertiary, fontFamily: 'monospace', fontSize: '0.78rem', m: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {pattern}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Additional Properties accordion */}
          {extraEntries.length > 0 && (
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                bgcolor: COLORS.headerBackground,
                border: `1px solid ${COLORS.dataContainerBorder}`,
                borderRadius: '8px !important',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: COLORS.textMuted }} />}
                sx={{ minHeight: 40, '& .MuiAccordionSummary-content': { my: 0 } }}
              >
                <Typography sx={{ color: COLORS.textMuted, fontFamily: 'monospace', fontSize: '0.75rem', letterSpacing: 1, textTransform: 'uppercase' }}>
                  Additional Properties ({extraEntries.length})
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {extraEntries.map(([key, val]) => (
                    <Box key={key}>
                      <Typography sx={{ color: COLORS.textMuted, fontFamily: 'monospace', fontSize: '0.68rem', letterSpacing: 1, textTransform: 'uppercase', mb: 0.25 }}>
                        {key}
                      </Typography>
                      <Typography sx={{ color: COLORS.textPrimary, fontFamily: 'monospace', fontSize: '0.78rem', wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                        {typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          )}

          <Divider sx={{ borderColor: COLORS.dataContainerBorder }} />
        </>
      )}

      {/* Relationship tables — render independently of object load state */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h6" sx={{ color: COLORS.textPrimary, fontFamily: 'monospace', fontSize: '0.85rem', letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Relationships
        </Typography>

        {relsLoading && <LoadingSpinner />}
        {relsError && <ErrorDisplay message={relsError} />}

        {!relsLoading && !relsError && rels && (
          <>
            <RelationshipTable title="References (This → Other)" rows={rels.references} navigate={navigate} />
            <RelationshipTable title="Referenced By (Other → This)" rows={rels.referenced_by} navigate={navigate} />
          </>
        )}
      </Box>
    </Box>
  );
}
