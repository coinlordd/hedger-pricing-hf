import { FIXParser, LicenseManager } from 'fixparser'

import { FIXClient } from './client'
import { clientOptions, FIXOptions, license } from '../config'

void LicenseManager.setLicenseKey(license)

const parser = new FIXParser()
const client = new FIXClient(parser, clientOptions, FIXOptions)

export default client
