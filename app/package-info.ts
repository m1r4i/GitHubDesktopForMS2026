import { bundleID, companyName, productName, version } from './package.json'

export function getProductName() {
  return process.env.NODE_ENV === 'development'
    ? `${productName}-dev`
    : productName
}

export function getCompanyName() {
  return companyName
}

/**
 * The version of the app. `yarn build:team` sets DESKTOP_VERSION_OVERRIDE to
 * give every team build a higher version than the previous one, which lets
 * installers update an existing installation in place.
 */
export function getVersion() {
  return process.env.DESKTOP_VERSION_OVERRIDE || version
}

export function getBundleID() {
  return process.env.NODE_ENV === 'development' ? `${bundleID}Dev` : bundleID
}
