import {checkIfLinkInsideLabel} from "./checkIfLinkInsideLabel";
import {checkIfHtmlTagHasLangAttribute} from "./checkIfHtmlTagHasLangAttribute";
import {checkIfImageWithoutAlt} from "./checkIfImageWithoutAlt";
import {checkIfButtonWithoutType} from "./checkIfButtonWithoutType";
import {checkIfButtonInsideALink} from "./checkIfButtonInsideALink";
import {checkIfLinkInsideAButton} from "./checkIfLinkInsideAButton";
import {checkIfMainLang} from "./checkIfMainLang";
import {checkIfCypressAxe} from "./checkIfCypressAxe";
import {checkIfLandmarks} from "./checkIfLandmarks";
import {checkIfReadme} from "./checkIfReadme";
import {checkIfTitle} from "./checkIfTitle";
import {checkIfTableCaption} from "./checkIfTableCaption";
import {checkIfMultipleNavWithoutLabel} from "./checkIfMultupleNavWithoutLabel";
import {checkIfCi} from "./checkIfCI";
import {checkIfCountInsteadOfExist} from "./checkIfCountInsteadOfExist";
import {checkIfNoDuplicatePageTitle} from "./checkIfNoDuplicatePageTitle";
import {checkIfTypescriptConstEnum} from "./checkIfTypescriptConstEnum";
import {checkIfImgRoleForSvgImage} from "./checkIfImgRoleForSvgImage";
import {npmRules} from "./checkNPMDependencies";
import { checkIfLighthouseCI } from "./checkIfLighthouseCI";

export const asyncRulesPerPage = [
    checkIfImgRoleForSvgImage
]

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
    checkIfLandmarks
];

export const asyncRules = [ checkIfCi, checkIfLighthouseCI, checkIfCountInsteadOfExist, checkIfTypescriptConstEnum ];
export const rules = [...npmRules, checkIfCypressAxe, checkIfNoDuplicatePageTitle];
