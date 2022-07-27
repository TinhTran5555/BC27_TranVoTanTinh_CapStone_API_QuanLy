main();
// Block input id 
document.getElementById("id").disabled = true;
function main() {
  // B1: Gọi API lấy danh sách sản phẩm
  apiGetProducts().then(function (result) {
    // Tạo biến products nhận kết quả trả về từ API
    var products = result.data;
    // Sau khi đã lấy được data từ API thành công
    // Duyệt mảng data và khởi tạo các đối tượng Product
    for (let i = 0; i < products.length; i++) {
      var product = products[i];
      products[i] = new Product(
        product.id,
        product.name,
        product.price,
        product.screen,
        product.backCamera,
        product.frontCamera,
        product.img,
        product.desc,
        product.type
      );
    }
    // Gọi hàm display để hiển thị danh sách sản phẩm ra giao diện
    display(products);
  });
}

function display(products) {
  var html = "";
  for (var i = 0; i < products.length; i++) {
    var product = products[i];
    html += `
      <tr>
        <td>${i + 1}</td>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.screen}</td>
        <td>${product.backCamera}</td>
        <td>${product.frontCamera}</td>
        <td>
          <img src="${product.img}" width="70px" height="70px" />
        </td>
        <td>${product.desc}</td>
        <td>${product.type}</td>
        <td>
          <button
            class="btn btn-primary"
            data-toggle="modal"
            data-target="#myModal"
            data-type="update"
            data-id="${product.id}"
          >
            Cập Nhật
          </button>
          <button
            class="btn btn-danger"
            data-type="delete"
            data-id="${product.id}"
          >
            Xoá
          </button>
        </td>
      </tr>
    `;
  }
  // DOM tới tbody và innerHTML bằng biến html
  document.getElementById("tblDanhSachSanPham").innerHTML = html;
}

// Hàm xử lý gọi API thêm sản phẩm
function addProduct() {
  // B1: DOM lấy value
  var id = document.getElementById("id").value;
  var name = document.getElementById("name").value;
  var price = document.getElementById("price").value;
  var screen = document.getElementById("screen").value;
  var backCamera = document.getElementById("backCamera").value;
  var frontCamera = document.getElementById("frontCamera").value;
  var img = document.getElementById("image").value;
  var desc = document.getElementById("description").value;
  var type = document.getElementById("type").value;



  // Tạo validation
  var isVali = validation();

  if (!isVali) {
    return;
  }
  // B2: Khởi tạo đối tượng Product
  var product = new Product(id, name, price, screen, backCamera, frontCamera, img, desc, type);
  // B3: Gọi API thêm sản phẩm

  apiAddProduct(product)
    .then(function (result) {
      // Thêm thành công, tuy nhiên lúc này dữ liệu chỉ mới được thay đổi ở phía server
      // Gọi tới hàm main để call API get products và hiển thị ra giao diện
      main();
      resetForm();
    })
    .catch(function (error) {
     
    });
}
function deleteProduct(productId) {
  apiDeleteProduct(productId)
    .then(function () {
      // Xoá thành công
      main();
    })
    .catch(function (error) {
      
    });
}

// Hàm xử lý gọi API cập nhật sản phẩm
function updateProduct() {
  // B1: DOM lấy value
  var id = document.getElementById("id").value;
  var name = document.getElementById("name").value;
  var price = document.getElementById("price").value;
  var screen = document.getElementById("screen").value;
  var backCamera = document.getElementById("backCamera").value;
  var frontCamera = document.getElementById("frontCamera").value;
  var img = document.getElementById("image").value;
  var desc = document.getElementById("description").value;
  var type = document.getElementById("type").value;

  // Tạo validation
  var isVali = validation();

  if (!isVali) {
    return;
  }

  // B2: Khởi tạo đối tượng Product
  var product = new Product(id, name, price, screen, backCamera, frontCamera, img, desc, type);

  // B3: Gọi API cập nhật sản phẩm
  apiUpdateProduct(product)
    .then(function (result) {
      // Cập nhật thành công, dữ liệu chỉ mới thay đổi ở phía server, cần gọi lại API getProducts và hiển thị lại giao diện
      main();
      resetForm();
    })
    .catch(function (error) {
    console.log(error);

    });
}
function resetForm() {
  // Reset form
  document.getElementById("id").value = "";
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("screen").value = "";
  document.getElementById("backCamera").value = "";
  document.getElementById("frontCamera").value = "";
  document.getElementById("image").value = "";
  document.getElementById("description").value = "";
  document.getElementById("type").value = "Chọn loại sản phẩm";
  // Đóng modal (vì sử dụng bootstrap nên phải tuân theo cách làm của nó)
  $("#myModal").modal("hide");
}


function resetTb() {
  document.getElementById("tbName").style.display = "none";
  document.getElementById("tbPrice").style.display = "none";
  document.getElementById("tbScreen").style.display = "none";
  document.getElementById("tbBackCamera").style.display = "none";
  document.getElementById("tbFrontCamera").style.display = "none";
  document.getElementById("tbImage").style.display = "none";
  document.getElementById("tbType").style.display = "none";
  document.getElementById("tbDesc").style.display = "none";

}

// DOM
document.getElementById("btnThemSanPham").addEventListener("click", showAddModal);
function showAddModal() {
  // Thay đổi text của modal heading
  document.querySelector(".modal-title").innerHTML = "Thêm sản phẩm";
  document.querySelector(".modal-footer").innerHTML = `
    <button
      class="btn btn-primary"
      data-type="add"
    >
      Thêm
    </button>
    <button
      class="btn btn-secondary"
      data-toggle="modal"
      data-target="#myModal"
    >
      Huỷ
    </button>
  `;
  resetTb();
}

// Uỷ quyền lắng nghe event của các button từ thẻ .modal-footer
document.querySelector(".modal-footer").addEventListener("click", handleSubmit);
// Các hàm callback được gọi tới khi event được kích hoạt đồng thời nhận được 1 tham số là đối tượng Event
function handleSubmit(event) {
  var type = event.target.getAttribute("data-type");

  switch (type) {
    case "add":
      addProduct();
      break;
    case "update":
      updateProduct();
      break;
    default:
      break;
  }
}

// Uỷ quyền lắng nghe tất cả event của button Xoá và Cập nhật trong table cho tbody
document
  .getElementById("tblDanhSachSanPham")
  .addEventListener("click", handleProductAction);

function handleProductAction(event) {
  // Loại button (delete || update)
  var type = event.target.getAttribute("data-type");
  // Id của sản phẩm
  var id = event.target.getAttribute("data-id");

  switch (type) {
    case "delete":
      deleteProduct(id);
      break;
    case "update": {
      // Cập nhật giao diện cho modal và call API get thông tin của sản phẩm và fill lên form
      showUpdateModal(id);
      break;
    }

    default:
      break;
  }
}
// Hàm này dùng để cập nhật giao diện cho modal update và call API lấy chi tiết sản phẩm để hiển thị lên giao diện
function showUpdateModal(productId) {
  // Thay đổi text của modal heading/ modal footer
  document.querySelector(".modal-title").innerHTML = "Cập nhật sản phẩm";
  document.querySelector(".modal-footer").innerHTML = `
    <button
      class="btn btn-primary"
      data-type="update"
    >
      Cập nhật
    </button>
    <button
      class="btn btn-secondary"
      data-dismiss="modal"
    >
      Huỷ
    </button>
  `;
  resetTb();

  // Hàm lấy thông tin sản phẩm
  apiGetProductDetail(productId)
    .then(function (result) {
      // Thành công, fill data lên form
      var product = result.data;
      document.getElementById("id").value = product.id;
      document.getElementById("name").value = product.name;
      document.getElementById("price").value = product.price;
      document.getElementById("screen").value = product.screen;
      document.getElementById("backCamera").value = product.backCamera;
      document.getElementById("frontCamera").value = product.frontCamera;
      document.getElementById("image").value = product.img;
      document.getElementById("description").value = product.desc;
      document.getElementById("type").value = product.type;
    })
    .catch(function (error) {
     
    });
}
// Hàm tiềm kiếm sản phẩm
// + Bằng phím enter 
document.getElementById("txtSearch").addEventListener("keypress", handleSearch);
function handleSearch(evt) {
  
  // Kiểm tra nếu key click vào không phải là Enter thì bỏ qua
  if (evt.key !== "Enter") return;

  // Nếu key click vào là Enter thì bắt đầu lấy value của input và get products
  var value = evt.target.value;
  apiGetProducts(value).then(function (result) {
    // Tạo biến products nhận kết quả trả về từ API
    var products = result.data;
    // Sau khi đã lấy được data từ API thành công
    // Duyệt mảng data và khởi tạo các đối tượng Product
    for (var i = 0; i < products.length; i++) {
      var product = products[i];
      products[i] = new Product(
        product.id,
        product.name,
        product.price,
        product.screen,
        product.backCamera,
        product.frontCamera,
        product.img,
        product.desc,
        product.type
      );
    }
    // Gọi hàm display để hiển thị danh sách sản phẩm ra giao diện
    display(products);
  });
}
// + Bằng icon search 
document.getElementById("txtSearchButton").addEventListener("click", handleSearchButton);
function handleSearchButton() {


  // DOM tới input lấy giá trị để tìm kiếm
  var value = document.getElementById("txtSearch").value;
  apiGetProducts(value).then(function (result) {
    // Tạo biến products nhận kết quả trả về từ API
    var products = result.data;
    // Sau khi đã lấy được data từ API thành công
    // Duyệt mảng data và khởi tạo các đối tượng Product
    for (var i = 0; i < products.length; i++) {
      var product = products[i];
      products[i] = new Product(
        product.id,
        product.name,
        product.price,
        product.screen,
        product.backCamera,
        product.frontCamera,
        product.img,
        product.desc,
        product.type
      );
    }
    // Gọi hàm display để hiển thị danh sách sản phẩm ra giao diện
    display(products);
  });
}
// Hàm kiểm khi thêm và cập nhật nhân viên
function validation() {
  // Dom tới các input và lấy giá trị
  var name = document.getElementById("name").value;
  var price = document.getElementById("price").value;
  var screen = document.getElementById("screen").value;
  var backCamera = document.getElementById("backCamera").value;
  var frontCamera = document.getElementById("frontCamera").value;
  var img = document.getElementById("image").value;
  var desc = document.getElementById("description").value;
  var type = document.getElementById("type").value;
  // Tạo biến cờ hiệu
  var isValid = true;
  // Kiểm tra tên
  var namePattern = new RegExp("^[a-zA-Z0-9 ]+$");
  if (!isRequired(name)) {
   
    isValid = false;
    document.getElementById("tbName").style.display = "block";
    document.getElementById("tbName").innerHTML =
      "Tên điện thoại không được để trống";
  } else if (!namePattern.test(name)) {
    
    isValid = false;
    document.getElementById("tbName").style.display = "block";
    document.getElementById("tbName").innerHTML =
      "Tên điện thoại không đúng định dạng";
  }
  // Kiểm tra giá sản phẩm
  var pricePattern = new RegExp("^[0-9$]+$");
  if (!isRequired(price)) {
    isValid = false;
    document.getElementById("tbPrice").style.display = "block";
    document.getElementById("tbPrice").innerHTML =
      "Thông tin giá sản phẩm không được để trống";
  } else if (!pricePattern.test(price)) {
    
    isValid = false;
    document.getElementById("tbPrice").style.display = "block";
    document.getElementById("tbPrice").innerHTML =
      "Thông tin giá sản phẩm không đúng định dạng";
  }
  // Kiểm tra màn hình
  var screenPattern = new RegExp("^[a-zA-Z0-9 ]+$");
  if (!isRequired(screen)) {
   
    isValid = false;
    document.getElementById("tbScreen").style.display = "block";
    document.getElementById("tbScreen").innerHTML =
      "Thông tin màn hình không được để trống";
  } else if (!screenPattern.test(screen)) {
   
    isValid = false;
    document.getElementById("tbScreen").style.display = "block";
    document.getElementById("tbScreen").innerHTML =
      "Thông tin màn hình không đúng định dạng";
  }
  // Kiểm tra cam sau
  var cameraPattern = new RegExp("^[a-zA-Z0-9:&,-_ àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ]+$");
  if (!isRequired(backCamera)) {
    
    isValid = false;
    document.getElementById("tbBackCamera").style.display = "block";
    document.getElementById("tbBackCamera").innerHTML =
      "Thông tin camera sau không được để trống";
  } else if (!cameraPattern.test(backCamera)) {
    
    isValid = false;
    document.getElementById("tbBackCamera").style.display = "block";
    document.getElementById("tbBackCamera").innerHTML =
      "Thông tin camera sau không đúng định dạng";
  }
  // Kiểm tra cam trước
  if (!isRequired(frontCamera)) {
    
    isValid = false;
    document.getElementById("tbFrontCamera").style.display = "block";
    document.getElementById("tbFrontCamera").innerHTML =
      "Thông tin camera trước không được để trống";
  } else if (!cameraPattern.test(frontCamera)) {
    
    isValid = false;
    document.getElementById("tbFrontCamera").style.display = "block";
    document.getElementById("tbFrontCamera").innerHTML =
      "Thông tin camera trước không đúng định dạng";
  }
  // Kiểm tra loại sản phẩm
  if (!isRequired(type)) {
    isValid = false;
    document.getElementById("tbType").style.display = "block";
    document.getElementById("tbType").innerHTML =
      "loại sản phẩm không được để trống";
  } else if (type === "Chọn loại sản phẩm") {
    isValid = false;
 
    document.getElementById("tbType").style.display = "block";
    document.getElementById("tbType").innerHTML = "Vui lòng chọn loại sản phẩm";
  }
  // Kiểm tra mô tả
  var descPattern = new RegExp("^[0-9a-zA-Z àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ,.%-]{1,300}$");
  if (!isRequired(desc)) {
   
    isValid = false;
    document.getElementById("tbDesc").style.display = "block";
    document.getElementById("tbDesc").innerHTML =
      "Thông tin mô tả không được để trống";
  } else if (!descPattern.test(desc)) {
   
    isValid = false;
    document.getElementById("tbDesc").style.display = "block";
    document.getElementById("tbDesc").innerHTML =
      "Thông tin mô tả không đúng định dạng";
  }
  return isValid;
}
// Hàm kiểm tra rổng hay không
function isRequired(value) {
  if (!value) {
    return false;
  }

  return true;
}