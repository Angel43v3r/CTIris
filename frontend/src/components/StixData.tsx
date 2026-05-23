import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { COLORS } from '../constants/themeColors';

function stixSampleData(
    type: string,
    name: string,
    created: string,
) {
    return { type, name, created };
}

const rows = [
    stixSampleData('indicator', 'Suspicious Domain IOC', '1hr ago'),
    stixSampleData('malware', 'Unicorn payload', '15m ago'),
    stixSampleData('threat actor', 'ABC123', '15m ago'),
    stixSampleData('campaign', 'Red X Dragon', '15m ago'),
    stixSampleData('vulnerability', 'ABC-1234-567', '10m ago')
];

export default function StixData() {
    return (
        <TableContainer sx={{ backgroundColor: COLORS.headerBackground, border: '2px solid rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650, backgroundColor: 'transparent', 
                '& .MuiTableCell-root': {borderBottom: '1px solid rgba(255,255,255,0.08)'}, }} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: COLORS.textOutline, fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' }}>Type</TableCell>
                        <TableCell sx={{ color: COLORS.textOutline, fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' }}>Name</TableCell>
                        <TableCell sx={{ color: COLORS.textOutline, fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' }}>Created</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((r) => (
                        <TableRow key={r.name} sx={{ '&:hover': {backgroundColor: 'rgba(0, 255, 255, 0.05)', cursor: 'pointer' }}}>
                            <TableCell sx={{ color: COLORS.textPrimary }}>{r.type}</TableCell>
                            <TableCell sx={{ color: COLORS.textPrimary }}>{r.name}</TableCell>
                            <TableCell sx={{ color: COLORS.textPrimary }}>{r.created}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
};