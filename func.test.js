const { Builder, By, Key, until } = require('selenium-webdriver');
require('selenium-webdriver/chrome');
var sleep = require('sleep');

jest.setTimeout(15000);


var driver;
var returnedText;
beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

async function mockSignup() {

  //navigate to signup page
  driver.get('http://localhost:3000/#!/signUp');

  //sign up a user
  await driver.findElement(By.id('newUserUsername')).sendKeys('dummySeleniumUser', Key.RETURN);
  await driver.findElement(By.id('newUserEmail')).sendKeys('tierra@cis557.com', Key.RETURN);
  await driver.findElement(By.id('newUserPass')).sendKeys('Passwordfordummysel1', Key.TAB);
  await driver.findElement(By.id('createUser-btn')).click();
}

async function mockLogin() {
  //navigate to login page
  driver.get('http://localhost:3000/');

  //login new user from prior test
  await driver.findElement(By.id('loginemail')).sendKeys('tierra@cis557.com', Key.RETURN);
  await driver.findElement(By.id('loginpass')).sendKeys('Passwordfordummysel1', Key.TAB);
  await driver.findElement(By.id('lg-btn')).click();

  await driver.findElement(By.id('prof')).click();
  await sleep.sleep(1);

  await driver.findElement(By.id('editP')).click();
  await sleep.sleep(1);

  // driver.get('http://localhost:3000/#!/edit-profile');

  await driver.findElement(By.id('enterUser')).clear();
  await driver.findElement(By.id('enterUser')).sendKeys('T i e r r a !', Key.TAB);
  await driver.findElement(By.id('enterUser-btn')).click();

  await sleep.sleep(1);

  await driver.findElement(By.id('enterBio')).sendKeys('changing my bio to this now and you will see this change reflected once i finish typing and hit save!', Key.TAB);
  await driver.findElement(By.id('enterBio-btn')).click();
  await sleep.sleep(1);

  await driver.findElement(By.id('prof')).click();
  await sleep.sleep(1);

  await driver.findElement(By.id('foll')).click();
  await sleep.sleep(1);

  await driver.findElement(By.id('act')).click();
  await sleep.sleep(1);

  await driver.findElement(By.id('f')).click();

}


async function mockUploadPic() {
  //navigate to homepage
  driver.get('http://localhost:3000/#!/home');
  await driver.findElement(By.id('f')).click();
  await driver.findElement(By.id('f-upload')).click();
}

async function mockPostCaption() {
  driver.get('http://localhost:3000/#!/home');
  // await driver.findElement(By.id('f-upload')).sendKeys("file.jpg");
  await driver.findElement(By.id('createCaption')).sendKeys('here, i am writing a caption for my upload then logging out!', Key.ENTER);
  await sleep.sleep(2);
  await driver.findElement(By.id('tag-btn')).click();
  // await driver.findElement(By.id('publish')).click();
}

async function mockLogout() {
  driver.get('http://localhost:3000/#!/home');
  await driver.findElement(By.id('l-out')).click();
  // await driver.findElement(By.id('publish')).click();
}


it('signs up user', async () => {
signup = await mockSignup();
expect(signup).not.toBeNull(); //if null, there was an issue
expect(driver.findElement(By.id('f'))).toBeTruthy();
});

it('logs in valid user and updates profile', async () => {
login = await mockLogin();
expect(login).not.toBeNull();
expect(driver.findElement(By.id('prof'))).toBeTruthy();
});

it('creates caption for post', async () => {
caption = await mockPostCaption();
expect(caption).not.toBeNull();
expect(driver.findElement(By.id('tag-btn'))).toBeTruthy();
});

it('logs out user', async () => {
logout = await mockLogout();
expect(logout).not.toBeNull();
});


/*
it('uploads pic for post', async () => {
upload = await mockUploadPic();
expect(upload).not.toBeNull();
// expect(returnedText).toEqual("City: Douala * Temp: 88.7");
});
*/
