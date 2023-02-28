import { checkIfLinkInsideLabel } from './lib/checkIfLinkInsideLabel';
import { checkIfHtmlTagHasLangAttribute } from './lib/checkIfHtmlTagHasLangAttribute';
import { checkIfImageWithoutAlt } from './lib/checkIfImageWithoutAlt';
import { checkIfButtonWithoutType } from './lib/checkIfButtonWithoutType';
import { checkIfButtonInsideALink } from './lib/checkIfButtonInsideALink';
import { checkIfLinkInsideAButton } from './lib/checkIfLinkInsideAButton';
import { checkIfMainLang } from './lib/checkIfMainLang';
import { checkIfCypressAxe } from './lib/checkIfCypressAxe';
import { checkIfLandmarks } from './lib/checkIfLandmarks';
import { checkIfReadme } from './lib/checkIfReadme';
import { checkIfTitle } from './lib/checkIfTitle';
import { checkIfTableCaption } from './lib/checkIfTableCaption';
import { checkIfMultipleNavWithoutLabel } from './lib/checkIfMultupleNavWithoutLabel';
import { checkIfCi } from './lib/checkIfCI';
import { checkIfCountInsteadOfExist } from './lib/checkIfCountInsteadOfExist';
import { checkIfNoDuplicatePageTitle } from './lib/checkIfNoDuplicatePageTitle';
import { checkIfTypescriptConstEnum } from './lib/checkIfTypescriptConstEnum';
import { checkIfImgRoleForSvgImage } from './lib/checkIfImgRoleForSvgImage';
import { npmRules } from './lib/checkNPMDependencies';
import { checkIfLighthouseCI } from './lib/checkIfLighthouseCI';

export const asyncRulesPerPage = [checkIfImgRoleForSvgImage];

export const rulesPerPage = [
  checkIfLinkInsideLabel,
  checkIfHtmlTagHasLangAttribute,
  checkIfImageWithoutAlt,
  checkIfButtonWithoutType,
  checkIfButtonInsideALink,
  checkIfLinkInsideAButton,
  checkIfMainLang,
  checkIfLandmarks,
  checkIfReadme,
  checkIfTitle,
  checkIfTableCaption,
  checkIfMultipleNavWithoutLabel,
  checkIfLandmarks,
];

export const asyncRules = [
  checkIfCi,
  checkIfLighthouseCI,
  checkIfCountInsteadOfExist,
  checkIfTypescriptConstEnum,
];
export const rules = [
  ...npmRules,
  checkIfCypressAxe,
  checkIfNoDuplicatePageTitle,
];
