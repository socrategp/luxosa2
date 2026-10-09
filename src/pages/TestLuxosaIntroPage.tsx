import { useNavigate } from 'react-router-dom';
import { DiagnosticTakeover } from '../components/DiagnosticTakeoverTest';
import CustomCursor from '../components/CustomCursor';

/**
 * Preview-only page — accessible at /test-luxosa-intro
 * Shows the Luxosa Test with the new "Lei" intro screen only.
 * Uses an isolated copy of DiagnosticTakeover — does NOT affect the production test.
 * Renders CustomCursor directly since this route sits outside MainLayout (which
 * is the only place it's normally mounted).
 */
export default function TestLuxosaIntroPage() {
  const navigate = useNavigate();
  return (
    <>
      <CustomCursor />
      <DiagnosticTakeover onReset={() => navigate('/')} />
    </>
  );
}
