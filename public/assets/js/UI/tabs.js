function switchTab(tabID) {
  var tab = document.getElementById(tabID);
  var tabs = tab.parentElement;

  var children = tabs.children;
  for (var i = 0; i < children.length; i++) {
    children[i].style.display = "none";
  }

  tab.style.display = "inherit";
}
