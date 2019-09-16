import $ from 'jquery';

const domUpdates = {
  appendText(element, text) {
    $(element).text(text);
  },

  toggleContent(element) {
    let allContent = ['.section--main-content', '.section--orders-content', '.section--rooms-content', '.section--customer-content']
    let selectedContent = $(element);
    let otherContent = allContent.filter(content => content !== element);
    otherContent.forEach(content => $(content).hide());
    selectedContent.show();
  },

  toggleTabs(element) {
    let allTabs = ['.li--main', '.li--orders', '.li--rooms', '.li--customer'];
    let selectedTab = $(element);
    let otherTabs = allTabs.filter(tab => tab !== element);
    otherTabs.forEach(tab => {
      $(tab).addClass('inactive');
      $(tab).removeClass('active');
    });
    selectedTab.addClass('active');
    selectedTab.removeClass('inactive');

  }
}


export default domUpdates;