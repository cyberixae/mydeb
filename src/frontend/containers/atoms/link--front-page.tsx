
import { Link } from 'react-router-dom';

export type FrontPageLinkProps = {
  readonly children: React.ReactNode
}

export const FrontPageLink: React.FC<FrontPageLinkProps> = ({ children }) => {
  return <Link to="/">{children}</Link>
} 
