const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const {
  clickElement,
  getText,
  getDays,
  getMovieTime,
  getSeatSelector,
} = require("../../lib/commands.js");

Before(async function () {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("user enters the page {string}", async function (string) {
  return await this.page.goto(`http://qamid.tmweb.ru${string}`, {
    setTimeout: 20000,
  });
});

When("user choose date {string}", async function (string) {
  return await getDays(this.page, string);
});

When(
  "user choose movie {string} time {string}",
  async function (string, string2) {
    return await getMovieTime(this.page, string, string2);
  }
);

When("user choose a sit {string}, {string}", async function (string, string2) {
  return await getSeatSelector(this.page, string, string2);
});

When("user click on the booking button", async function () {
  return await clickElement(this.page, "body > main > section > button");
});
When("user click on the button to get booking code", async function () {
  return await clickElement(this.page, "body > main > section > div > button");
});

Then("user get the code and text {string}", async function (string) {
  const actual = await getText(
    this.page,
    "body > main > section > header > h2"
  );
  const expected = await string;
  expect(actual).contains(expected);
});

Then("button for booking is inactive {string}", async function (string) {
  const actual = String(
    await this.page.$eval("button", (button) => {
      return button.disabled;
    })
  );
  const expected = await string;
  expect(actual).contains(expected);
});
