import $ from 'jquery';

const domUpdates = {
  appendText(element, text) {
    $(element).text(text);
  },

  addText(text, element) {
    console.log(text);
    $(text).appendTo(element)
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

  },

  toggleModal() {
    $('.div--modal-background').toggle();
    $('.section--error').toggle();
  },

  toggleShow(element) {
    $(element).toggle();
  },

  clearField(field) {
    field.val('');
  }
}


export default domUpdates;