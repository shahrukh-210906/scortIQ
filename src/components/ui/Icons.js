import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAtom,                // Replaces PhysicsIcon (conceptually)
  faFlask,               // Replaces ChemistryIcon
  faDna,                 // Replaces BiologyIcon
  faCheckCircle,         // Replaces CheckCircleIcon
  faHourglassHalf,       // Replaces InProgressIcon
  faExclamationTriangle, // Replaces WarningIcon
  faPaperPlane,          // Replaces SendIcon
  faBrain,               // Replaces BrainIcon
  faChevronDown,         // Replaces ChevronDown
  faArrowLeft,           // Replaces BackIcon
  faBox,                 // Replaces SandboxIcon
  faChartBar,            // Replaces PerformanceIcon
  faUser,                // Replaces UserIcon
  faSignOutAlt,          // Replaces LogoutIcon
  faLightbulb,           // Replaces Logo (conceptually)
  faBook,                // For FloatingElements
  faPencilAlt,           // For FloatingElements
  faRulerCombined,       // For FloatingElements - Protractor replacement
} from '@fortawesome/free-solid-svg-icons';

// Note: The direct SVG Logo is replaced with a conceptual icon (faLightbulb).
// You might want to keep the original SVG Logo or use a different Font Awesome icon.
export const Logo = (props) => (
  <FontAwesomeIcon icon={faLightbulb} {...props} className="h-7 w-7 text-brand-primary" />
);

// We keep the colored background divs for subject icons for consistency
export const PhysicsIcon = (props) => (
  <div className="p-3 rounded-xl mr-4 bg-subject-physics">
    <FontAwesomeIcon icon={faAtom} {...props} className="h-8 w-8 text-text-primary" />
  </div>
);

export const ChemistryIcon = (props) => (
  <div className="p-3 rounded-xl mr-4 bg-subject-chemistry">
    <FontAwesomeIcon icon={faFlask} {...props} className="h-8 w-8 text-text-primary" />
  </div>
);

export const BiologyIcon = (props) => (
  <div className="p-3 rounded-xl mr-4 bg-subject-biology">
    <FontAwesomeIcon icon={faDna} {...props} className="h-8 w-8 text-text-primary" />
  </div>
);

export const CheckCircleIcon = (props) => (
  <FontAwesomeIcon icon={faCheckCircle} {...props} className="h-5 w-5 text-brand-success" />
);

export const InProgressIcon = (props) => (
  <FontAwesomeIcon icon={faHourglassHalf} {...props} className="h-5 w-5 text-brand-orange" />
);

export const WarningIcon = (props) => (
  <FontAwesomeIcon icon={faExclamationTriangle} {...props} className="h-5 w-5 text-brand-danger" />
);

export const SendIcon = (props) => (
  <FontAwesomeIcon icon={faPaperPlane} {...props} className="h-5 w-5" />
);

export const BrainIcon = (props) => (
  <FontAwesomeIcon icon={faBrain} {...props} className="h-5 w-5" />
);

export const ChevronDown = (props) => (
  <FontAwesomeIcon icon={faChevronDown} {...props} className="h-6 w-6 text-text-tertiary" />
);

export const BackIcon = (props) => (
  <FontAwesomeIcon icon={faArrowLeft} {...props} className="h-5 w-5" />
);

export const SandboxIcon = (props) => (
  <FontAwesomeIcon icon={faBox} {...props} className="h-5 w-5" />
);

export const PerformanceIcon = (props) => (
  <FontAwesomeIcon icon={faChartBar} {...props} className="h-5 w-5" />
);

export const UserIcon = (props) => (
  <FontAwesomeIcon icon={faUser} {...props} className="h-5 w-5 text-brand-primary" />
);

export const LogoutIcon = (props) => (
  <FontAwesomeIcon icon={faSignOutAlt} {...props} className="h-4 w-4" />
);

// Icons for FloatingElements
export const FloatingBookIcon = (props) => <FontAwesomeIcon icon={faBook} {...props} />;
export const FloatingPencilIcon = (props) => <FontAwesomeIcon icon={faPencilAlt} {...props} />;
export const FloatingProtractorIcon = (props) => <FontAwesomeIcon icon={faRulerCombined} {...props} />;
export const FloatingAtomIcon = (props) => <FontAwesomeIcon icon={faAtom} {...props} />;

// Remove SvgDefs as it's no longer needed
// export const SvgDefs = () => null; // Or simply remove the export