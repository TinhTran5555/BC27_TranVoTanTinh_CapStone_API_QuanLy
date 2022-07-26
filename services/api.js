let baseUrl = "https://62b06198e460b79df0446b94.mockapi.io/apiSanPham"
// Call Api lấy danh sách sản phẩm
function apiGetProducts(search) {
    return axios ({
        url: baseUrl,
        method: "GET",
        params: {
            name: search
        }
    })
}
// Hàm call API thêm sản phẩm
function apiAddProduct(product) {
    return axios({
      url: baseUrl,
      method: "POST",
      data: product,
    });
  }
  
  // Hàm call API xoá sản phẩm
  function apiDeleteProduct(productId) {
    console.log(productId);
    return axios({
      url: `${baseUrl}/${productId}`,
      method: "DELETE",
    });
  }
  
  // Hàm call API lấy chi tiết sản phẩm
  function apiGetProductDetail(productId) {
    return axios({
      url: `${baseUrl}/${productId}`,
      method: "GET",
    });
  }
  
  // Hàm call API cập nhật sản phẩm
  function apiUpdateProduct(product) {
    return axios({
      url: `${baseUrl}/${product.id}`,
      data: product,
      method: "PUT",
    });
  }