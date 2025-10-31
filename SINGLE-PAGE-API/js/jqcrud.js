$(function () {
  loadPosts();
  $("#postsList").on("click", ".delete", handleDelete);
  $("#postsList").on("click", ".edit", handleUpdate);
  $("#storyForm").on("submit", addPost);
  $("#resetBtn").click(resetForm);
});

function loadPosts() {
  $("#loading").removeClass("d-none");
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "GET",
    success: function (response) {
      console.log(response);
      var posts = $("#postsList");
      posts.empty();
      for (var i = 0; i < response.length && i < 20; i++) {
        var post = response[i];
        posts.append(
          '<li class="item" data-id="' +
            post.id +
            '"><div class="meta"><div class="title">' +
            post.title +
            '</div><div class="text">' +
            post.body +
            '</div></div><div class="actions"><button class="btn edit">Edit</button><button class="btn delete">Delete</button></div></li>'
        );
      }
    },
    error: function () {
      var posts = $("#postsList");
      posts.html("An Error has occured");
    },
    complete: function () {
      $("#loading").addClass("d-none");
    },
  });
}

function addPost(e) {
  e.preventDefault();
  var title = $("#title").val();
  var body = $("#body").val();
  var postId = $("#storyId").val();

  if (!title || !body) {
    alert("Title and body are required.");
    return;
  }

  $("#saveBtn")
    .prop("disabled", true)
    .text(postId ? "Updating..." : "Saving...");

  if (postId) {
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/posts/" + postId,
      method: "PUT",
      data: { title: title, body: body, userId: 1 },
      success: function (response) {
        console.log(response);
        var item = $("#postsList .item[data-id='" + postId + "']");
        item.find(".title").text(title);
        item.find(".text").text(body);
        alert("Post updated.");
        resetForm();
      },
      error: function () {
        alert("Update failed.");
      },
      complete: function () {
        $("#saveBtn").prop("disabled", false).text("Update");
      },
    });
  } else {
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/posts",
      method: "POST",
      data: { title: title, body: body, userId: 1 },
      success: function (response) {
        console.log(response);
        var newId = response.id;
        $("#postsList").prepend(
          '<li class="item" data-id="' +
            newId +
            '"><div class="meta"><div class="title">' +
            title +
            '</div><div class="text">' +
            body +
            '</div></div><div class="actions"><button class="btn edit">Edit</button><button class="btn delete">Delete</button></div></li>'
        );
        alert("Post created.");
        resetForm();
      },
      error: function () {
        alert("Create failed.");
      },
      complete: function () {
        $("#saveBtn").prop("disabled", false).text("Save");
      },
    });
  }
}

function handleUpdate() {
  var btn = $(this);
  var item = btn.closest(".item");
  var postId = item.attr("data-id");
  var title = item.find(".title").text();
  var body = item.find(".text").text();
  $("#storyId").val(postId);
  $("#title").val(title);
  $("#body").val(body);
  $("#saveBtn").text("Update");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleDelete() {
  if (!confirm("Delete this post?")) return;
  var btn = $(this);
  var item = btn.closest(".item");
  var postId = item.attr("data-id");
  btn.prop("disabled", true).text("Deleting...");
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts/" + postId,
    method: "DELETE",
    success: function (response) {
      console.log(response);
      item.remove();
      alert("Post deleted.");
    },
    error: function () {
      alert("Delete failed.");
    },
    complete: function () {
      btn.prop("disabled", false).text("Delete");
    },
  });
}

function resetForm() {
  $("#storyId").val("");
  $("#title").val("");
  $("#body").val("");
  $("#saveBtn").text("Save");
}
