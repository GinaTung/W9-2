// 請代入自己的網址路徑
const api_path = "yuling-w9";
const token = "vPoflkfyBfRJSCUacJrh3e8ZXgy2";
//產品 DOM
const productWrap = document.querySelector('.productWrap');
const cartList = document.querySelector('.cartList');
const sum = document.querySelector('.sum');
const productSelect = document.querySelector('.productSelect');
//資料初始化
let productData = [];
let cartData = [];

getProductList();
getCartList();
// 取得產品列表
function getProductList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`).
    then(function (response) {
      console.log(response.data);
      productData = response.data.products;
      renderProductList();
    })
    .catch(function(error){
      console.log(error.response.data)
    })
}

//渲染產品畫面
function renderProductList(){
  let str = "";
  productData.forEach(function(item){
    str+=`<li class="productCard">
    <h4 class="productType">新品</h4>
    <img src="${item.images}" alt="">
    <a href="#" data-id="${item.id}" class="addCardBtn" data-js="js-addCart">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${item.origin_price}</del>
    <p class="nowPrice">NT$${item.price}</p>
    </li>`
  })
  productWrap.innerHTML = str;
  console.log(productData)
}

productSelect.addEventListener('change',function(e){
  let Select = e.target.value;
  if(Select=="全部"){
    renderProductList();
    return;
  }
  let str = "";
  productData.forEach(function (item) {
    if (item.category == Select ){
      str+=`<li class="productCard">
      <h4 class="productType">新品</h4>
    <img src="${item.images}" alt="">
    <a href="#" class="addCardBtn" data-id="${item.id}" data-js="js-addCart">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${item.origin_price}</del>
    <p class="nowPrice">NT$${item.price}</p>
    </li>`;
    }
  })
  productWrap.innerHTML = str;
  console.log(str)
})

productWrap.addEventListener('click',function(e){

  let addCartClass = e.target.getAttribute("data-js");
  if (addCartClass !=="js-addCart"){
  alert("test")
  }
  // console.log(e.target.getAttribute("data-id"))
  let productId2 = e.target.getAttribute("data-id");
  addCartItem(productId2);
})

// 取得購物車列表
function getCartList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      cartData = response.data.carts;

      let str = "";
      let str2 = "";
      cartData.forEach(function(item){
    str+=`<tr><td>
        <div class="cardItem-title">
        <img src="${item.product.image}" alt=""><p>${item.product.title}</p></div> 
        </td>
        <td>NT$${item.product.origin_price}</td>
        <td>${item.quantity}</td>
        <td>NT$${item.product.price}</td>
        <td class="discardBtn"> <a href="#" class="material-icons"  data-id="${item.id}"> clear  </a>
      </td></tr>`;
      str2=Number(str2);
      str2=`${Number(item.quantity)*Number(item.product.price)}`;
      })
      cartList.innerHTML = str;
     
      sum.innerHTML = str2;
    }
   
    )
    
}




// 加入購物車
function addCartItem(id){
  let numCheck = 1;
  cartData.forEach(function(item){
    if (item.product.id === id) {
      numCheck = item.quantity += 1;
    }
  })
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
    data: {
      "productId": id,
      "quantity": numCheck
    }
  }).
    then(function (response) {
      alert("加入購物車成功");
      getCartList();
    })

}

// 清除購物車內全部產品
function deleteAllCartList() {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      console.log(response.data);
    })
}

// 清除購物車內全部產品
const deleteAllCartBtn = document.querySelector('.discardAllBtn');
function deleteAllCartList(){
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
  .then(function (response) {
      alert("刪除全部購物車成功！");
      getCartList();
  })
  .catch(function (response) {
    alert("購物車已清空，請勿重複點擊！")
  })
}
deleteAllCartBtn.addEventListener('click',function(e){
  deleteAllCartList();
})


// 刪除購物車內特定產品
cartList.addEventListener('click', function (e) {
  let cartId = e.target.getAttribute('data-id');
  if (cartId == null) {
    return;
  }
  deleteCartItem(cartId);

})
function deleteCartItem(cartId) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
  .then(function (response) {
    alert("刪除單筆購物車成功！");
    getCartList();
  })
  
}

// 送出購買訂單#
const sendOrder = document.querySelector('#sendOrder');
sendOrder.addEventListener('click',function(e){
  let carthLength = document.querySelectorAll(".cartList li").length;
  if (carthLength==0){
    alert("請加入至少一個購物車品項！");
    return;
  }
  let orderName = document.querySelector('#customerName').value;
  let orderTel = document.querySelector('#customerPhone').value;
  let orderEmail = document.querySelector('#customerEmail').value;
  let orderAddress = document.querySelector('#customerAddress').value;
  let orderPayment = document.querySelector('#tradeWay').value;
  if (orderName == "" || orderTel == "" || orderEmail == "" || orderAddress==""){
    alert("請輸入訂單資訊！");
    return;
  }
  let data = {
    name: orderName,
    tel: orderTel,
    Email: orderEmail,
    address: orderAddress,
    payment: orderPayment
  }
  createOrder(data);
})
function createOrder(item){
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
    {
      "data": {
        "user": {
          "name": item.name,
          "tel": item.tel,
          "email": item.Email,
          "address": item.address,
          "payment": item.payment
        }
      }
    }
  ).then(function (response) {
      alert("訂單建立成功!")
      getCartList();
    })
}



// 取得訂單列表
function getOrderList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}

// 修改訂單狀態

function editOrderList(orderId) {
  axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      "data": {
        "id": orderId,
        "paid": true
      }
    },
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}

// 刪除全部訂單
function deleteAllOrder() {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}

// 刪除特定訂單
function deleteOrderItem(orderId) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}

