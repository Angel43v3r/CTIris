import { useState } from 'react';
import { Box, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import { COLORS } from '../constants/themeColors';
import DashboardTab from './DashboardTab';
import FeedsTab from './FeedsTab';
import StixBrowser from './StixBrowser';

function SectionHeader({ title, tooltip }: { title: string; tooltip: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
      <Typography variant="h6" sx={{ color: COLORS.textColor, fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Tooltip title={tooltip} placement="right" arrow>
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
  );
}

export default function DashboardBody() {
  const [tab, setTab] = useState(0);
  const [selectedType, setSelectedType] = useState('');

  function navigateToType(type: string) {
    setSelectedType(type);
    setTab(2);
  }

  return (
    <Box sx={{ bgcolor: COLORS.backgroundContainer, minHeight: '100vh', paddingX: 8, paddingY: 2 }}>
      <Tabs
        value={tab}
        onChange={(_, v: number) => setTab(v)}
        sx={{
          mb: 3,
          '& .MuiTab-root': { color: COLORS.textMuted, fontFamily: 'monospace', letterSpacing: 1.5, fontSize: '0.75rem' },
          '& .Mui-selected': { color: COLORS.accentSecondary },
          '& .MuiTabs-indicator': { backgroundColor: COLORS.accentSecondary },
        }}
      >
        <Tab label="DASHBOARD" />
        <Tab label="FEEDS" />
        <Tab label="STIX OBJECTS" />
      </Tabs>

      <Box sx={{ bgcolor: COLORS.backgroundDefault, padding: 4, borderRadius: 4, border: '2px solid rgba(255,255,255,0.05)' }}>
        <Box sx={{ display: tab === 0 ? 'block' : 'none' }}>
          <SectionHeader
            title="THREAT INTELLIGENCE SUMMARY"
            tooltip="Counts of the 10 core STIX Domain Object (SDO) types currently in the database. STIX (Structured Threat Information eXpression) is a standardized language for describing cyber threats — each type captures a different aspect, such as Malware for malicious software, Threat Actor for the groups behind attacks, or Vulnerability for known weaknesses."
          />
          <DashboardTab onTypeClick={navigateToType} />
        </Box>
        <Box sx={{ display: tab === 1 ? 'block' : 'none' }}>
          <SectionHeader
            title="FEED STATUS"
            tooltip="TAXII (Trusted Automated eXchange of Indicator Information) feeds are servers that publish STIX threat intelligence data on a schedule. CTIris polls each enabled feed and stores new objects in the database. Status shows whether the last poll succeeded, failed, or is paused."
          />
          <FeedsTab />
        </Box>
        <Box sx={{ display: tab === 2 ? 'block' : 'none' }}>
          <SectionHeader
            title="STIX OBJECTS"
            tooltip="A full browser of all STIX objects ingested from your feeds. Filter by type to narrow the list, or search by name or ID. Click any row to inspect the complete STIX JSON payload for that object."
          />
          <StixBrowser defaultType={selectedType} />
        </Box>
      </Box>
    </Box>
  );
}
