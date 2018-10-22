var frontEditor = new Quill('#front-editor', {
  modules: { toolbar: '#front-toolbar' },
  theme: 'snow'
});

var backEditor = new Quill('#back-editor', {
  modules: { toolbar: '#back-toolbar' },
  theme: 'snow'
});
