
          tinymce.init({
              selector: "textarea",
              menu: {
                table: {title: 'Table', items: 'inserttable tableprops deletetable | cell row column'}
              },
              plugins: [
                  "advlist autolink lists link image charmap preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table contextmenu paste"
              ],
              toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
          });