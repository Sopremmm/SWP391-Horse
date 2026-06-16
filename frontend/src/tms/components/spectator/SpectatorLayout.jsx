// Re-export HeritageLayout for backwards compatibility
// All spectator pages should ideally use HeritageLayout directly with role="spectator"
import HeritageLayout from "../layout/HeritageLayout.jsx";

export default function SpectatorLayout({ children }) {
  return <HeritageLayout role="spectator">{children}</HeritageLayout>;
}
