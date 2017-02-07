import { PlayFmJsProjectPage } from './app.po';

describe('play-fm-js-project App', function() {
  let page: PlayFmJsProjectPage;

  beforeEach(() => {
    page = new PlayFmJsProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
