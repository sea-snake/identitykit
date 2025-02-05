import { expect } from "@playwright/test"
import { test as base } from "@playwright/test"
import { DemoPage } from "./page/demo.page"
import { Icrc25RequestPermissionsSection } from "./section/icrc25-request-permissions.section"
import { Icrc25PermissionsSection } from "./section/icrc25-permissions.section"

type Fixtures = {
  section: Icrc25PermissionsSection
  demoPage: DemoPage
  requestPermissionSection: Icrc25RequestPermissionsSection
}

const test = base.extend<Fixtures>({
  section: async ({ page }, apply) => {
    const demoPage = new Icrc25PermissionsSection(page)
    await apply(demoPage)
  },
  requestPermissionSection: async ({ page }, apply) => {
    const requestPermissionSection = new Icrc25RequestPermissionsSection(page)
    await apply(requestPermissionSection)
  },
  demoPage: [
    async ({ page }, apply) => {
      const demoPage = new DemoPage(page)
      await demoPage.goto()
      await demoPage.login()
      await apply(demoPage)
    },
    { auto: true },
  ],
})

test.skip("should check request and response has correct initial state", async ({ section }) => {
  const request = {
    method: "icrc25_permissions",
  }

  const initialRequest = await section.getRequestJson()
  expect(initialRequest).toStrictEqual(request)

  const initialResponse = await section.getResponseJson()
  expect(initialResponse).toStrictEqual({})
})

test.skip("should retrieve empty permissions", async ({ section }) => {
  await section.clickSubmitButton()

  const actualResponse = await section.getResponseJson()
  expect(actualResponse).toStrictEqual({})
})

test.skip("should retrieve full list of permissions", async ({
  section,
  requestPermissionSection,
}) => {
  const response = [
    {
      scope: {
        method: "icrc27_accounts",
      },
      state: "granted",
    },
    {
      scope: {
        method: "icrc34_delegation",
      },
      state: "granted",
    },
    {
      scope: {
        method: "icrc49_call_canister",
      },
      state: "granted",
    },
  ]

  await requestPermissionSection.approvePermissions()
  await section.clickSubmitButton()
  await section.waitForResponse()

  const actualResponse = await section.getResponseJson()
  expect(actualResponse).toStrictEqual(response)
})
