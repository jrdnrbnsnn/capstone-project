const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const {
  client,
  createTables,
  getAllUsers,
  login,
  register,
  addProduct,
  createCart,
  addItemToCart,
  getCartItems,
  getAllProducts,
  getProductById,
  getAllCategories,
  getProductsByCategory,
  getCartByUserId,
  deleteCartItem,
} = require("./db");
const app = express();

app.use(express.json());
app.use(cors());
app.use(require("morgan")("dev"));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
app.use(express.static(path.join(__dirname, "../client/dist")));

// LOGIN ROUTE
app.post("/api/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await login(username, password);
    delete user.password;
    const token = jwt.sign(user, "secret");
    res.send({ user, token });
  } catch (error) {
    next(error);
  }
});

// REGISTER ROUTE
app.post("/api/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await register(username, password);
    delete user.password;
    const token = jwt.sign(user, "secret");
    res.send({ user, token });
  } catch (error) {
    next(error);
  }
});

// Requires token in app routes
function requireToken(req, res, next) {
  const token = req.headers.authorization;
  try {
    const user = jwt.verify(token, "secret");
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

// GET ALL USERS ROUTE - PROTECTED
app.get("/api/users", requireToken, async (req, res, next) => {
  const users = await getAllUsers();
  res.send(users.rows);
});

// Route to get all unique product categories
app.get("/api/categories", async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.json(categories.map((category) => category.category)); // Simplify the response to an array of strings
  } catch (error) {
    next(error);
  }
});

// Route to get products by category
app.get("/api/products/category/:categoryName", async (req, res, next) => {
  const { categoryName } = req.params;
  try {
    const products = await getProductsByCategory(categoryName);
    if (products.length === 0) {
      return res
        .status(404)
        .send({ message: "No products found in this category" });
    }
    res.json(products);
  } catch (error) {
    next(error);
  }
});

app.get("/api/products/:productId", async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Route to add a product - need to add amdin functionality
app.post("/api/products", async (req, res, next) => {
  const { name, price, description, qtyAvailable, category, imageUrl } =
    req.body;
  try {
    const product = await addProduct(
      name,
      price,
      description,
      qtyAvailable,
      category,
      imageUrl
    );
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// Route to add an item to a cart
app.post("/api/carts/add", requireToken, async (req, res, next) => {
  const { product_id, quantity } = req.body;
  try {
    // Check if the user already has a cart, if not, create one
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, "secret");
    const user_id = decodedToken.user_id;
    console.log(user_id);

    let userCart = await getCartByUserId(user_id);
    if (!userCart) {
      userCart = await createCart(user_id);
    }
    const cartItem = await addItemToCart(
      userCart.cart_id,
      product_id,
      quantity
    );
    res.status(201).json(cartItem);
  } catch (error) {
    next(error);
  }
});

// Route to view cart items
app.get("/api/carts/:user_id", requireToken, async (req, res, next) => {
  const token = req.headers.authorization;
  const decodedToken = jwt.verify(token, "secret");
  const user_id = decodedToken.user_id;
  try {
    const items = await getCartItems(user_id);
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// Route to get all products
app.get("/api/products", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// Route to delete an item from a cart that belongs to user
app.delete(
  "/api/carts/delete/:cart_item_id",
  requireToken,
  async (req, res, next) => {
    const { cart_item_id } = req.params;
    const user_id = req.user.user_id;
    try {
      const deletedItem = await deleteCartItem(cart_item_id, user_id);
      if (!deletedItem) {
        return res.status(404).send({
          message: "Cart item not found or does not belong to your cart",
        });
      }
      res.json({ message: "Cart item deleted successfully", deletedItem });
    } catch (error) {
      next(error);
    }
  }
);

app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .send({ error: err.message ? err.message : err });
});

async function init() {
  client.connect();
  createTables();
  const productsToSeed = [
    {
      name: "BOSS X NFL ZIP-NECK SWEATSHIRT WITH COLLABORATIVE BRANDING 1",
      price: 208.0,
      description:
        "A fantastic new prA relaxed-fit sweatshirt by BOSS Menswear, designed in stretch fleece and lustrous fabric and detailed with a zipped neck and collaborative branding. BOSS x NFL is a limited capsule that spotlights twenty-two popular NFL teams and celebrates the lifelong commitments that their players and fanbase make. Please note that this product is only available in men's sizes.",
      qtyAvailable: 100,
      category: "Men",
      imageUrl:
        "https://images.hugoboss.com/is/image/boss/hbna50504605_404_350?$re_fullPageZoom$&qlt=85&fit=crop,1&align=1,1&lastModified=1709135338000&wid=1200&hei=1818&fmt=webp",
    },
    {
      name: "TIE-NECKLINE SLEEVELESS DRESS WITH FRILL TRIMS",
      price: 695.0,
      description:
        "A sleeveless dress blended with silk by BOSS Womenswear, featuring frill trims and an adjustable tie at the neckline.",
      qtyAvailable: 100,
      category: "Women",
      imageUrl:
        "https://images.hugoboss.com/is/image/boss/hbna50514718_550_300?$re_fullPageZoom$&qlt=85&fit=crop,1&align=1,1&lastModified=1713196888000&wid=1200&hei=1818&fmt=webp",
    },

    {
      name: "STRETCH-COTTON REGULAR-FIT T-SHIRT WITH SEASONAL LOGO",
      price: 78.0,
      description:
        "A signature T-shirt in a regular fit by BOSS Menswear. Designed in stretch jersey, it features a patterned logo print at the chest.",
      qtyAvailable: 100,
      category: "Men",
      imageUrl:
        "https://images.hugoboss.com/is/image/boss/hbna50512999_001_350?$large$=&fit=crop,1&align=1,1&lastModified=1712588590000&wid=1600",
    },
    {
      name: "SLIM-FIT T-SHIRT IN A STRETCH-MODAL BLEND",
      price: 118.0,
      description:
        "A versatile T-shirt cut to a defined fit with cropped sleeves and a scoop neck in breathable stretch material by BOSS Womenswear.",
      qtyAvailable: 100,
      category: "Women",
      imageUrl:
        "https://images.hugoboss.com/is/image/boss/hbna50461122_001_350?$re_fullPageZoom$&qlt=85&fit=crop,1&align=1,1&lastModified=1709929921000&wid=1200&hei=1818&fmt=webp",
    },
    {
      name: "SLIM-FIT JEANS IN LIGHT-BLUE SOFT STRETCH DENIM",
      price: 198.0,
      description:
        "A fantastic new Super-soft jeans in light-blue stretch denim by BOSS Menswear, cut to a defined fit with a regular rise.",
      qtyAvailable: 100,
      category: "Men",
      imageUrl:
        "https://images.hugoboss.com/is/image/boss/hbna50521001_453_350?$re_fullPageZoom$&qlt=85&fit=crop,1&align=1,1&lastModified=1712931406000&wid=1200&hei=1818&fmt=webp",
    },
    {
      name: "RELAXED-FIT JEANS IN BLUE DENIM",
      price: 168.0,
      description:
        "Relaxed-fit jeans with a straight leg by HUGO Womenswear, crafted in mid-blue denim with an authentic wash and signature trims.",
      qtyAvailable: 100,
      category: "Women",
      imageUrl:
        "https://images.hugoboss.com/is/image/boss/hbna50508188_432_350?$re_fullPageZoom$&qlt=85&fit=crop,1&align=1,1&lastModified=1712932715000&wid=1200&hei=1818&fmt=webp",
    },
    {
      name: "MIXED-MATERIAL TRAINERS WITH SUEDE AND BRANDED TRIMS",
      price: 199.0,
      description:
        "Signature trainers by BOSS, crafted in a mix of materials including soft suede and detailed with branding and an EVA outsole.",
      qtyAvailable: 100,
      category: "Men",
      imageUrl:
        "https://images.hugoboss.com/is/image/boss/hbna50513179_060_200?$re_fullPageZoom$&qlt=85&fit=crop,1&align=1,1&lastModified=1713469942000&wid=1200&hei=1818&fmt=webp",
    },
    {
      name: "LEATHER PUMPS WITH MONOGRAM-PATTERNED HEELS",
      price: 499.99,
      description:
        "These leather pumps featured on the BOSS Fall/Winter 2023 runway, where they instantly commanded attention with their curved, monogram-cutout heels. They're expertly made in Italy from smooth leather and are completed with sharply pointed toes.",
      qtyAvailable: 100,
      category: "Women",
      imageUrl:
        "https://images.hugoboss.com/is/image/boss/hbna50513300_001_200?$re_fullPageZoom$&qlt=85&fit=crop,1&align=1,1&lastModified=1713473293000&wid=1200&hei=1818&fmt=webp",
    },
    {
      name: "FAUX-LEATHER HOLDALL WITH LOGO DETAILS",
      price: 199.99,
      description:
        "A distinctive holdall by BOSS, crafted in synthetic coated fabric with a large logo, branded trims and a detachable shoulder strap. Synthetic coated fabric, sometimes referred to as faux leather, is a fabric designed to resemble real leather, and/or display a matte, glossy, smooth, or textured, coated appearance.  Measurements: 27 x 51 x 23cm",
      qtyAvailable: 100,
      category: "Men",
      imageUrl:
        "https://images.hugoboss.com/is/image/boss/hbna50516885_110_200?$re_fullPageZoom$&qlt=85&fit=crop,1&align=1,1&lastModified=1713454886000&wid=1200&hei=1818&fmt=webp",
    },
    {
      name: "HUGO X IMAGINARY ONES BELT BAG",
      price: 199.99,
      description:
        "A Web3 tech-infused belt bag by HUGO, crafted in structured material with zipped closures and trims featuring the legendary emotions of HUGO x IO in chrome finishings. This style is specially designed to celebrate the 1-year anniversary of our partnership with Imaginary Ones. Deep dive into Web3 with the integrated NFC tag that leads you to a special digital redeemable in BUBBLE RANGERS, where you will have the chance to gain a different digital asset based on a special rarity. Collect them all! Measurements: 14 x 31 x 4cm",
      qtyAvailable: 100,
      category: "Women",
      imageUrl:
        "https://images.hugoboss.com/is/image/boss/hbna50521665_002_200?$re_fullPageZoom$&qlt=85&fit=crop,1&align=1,1&lastModified=1711459871000&wid=1200&hei=1818&fmt=webp",
    },
    {
      name: "BLUE SILICONE-STRAP CHRONOGRAPH WATCH WITH TONAL DIAL",
      price: 349.0,
      description:
        "A sporty chronograph watch, featuring a blue dial, orange accents and a rotating bezel, by BOSS. This accessory secures with a branded blue silicone strap.",
      qtyAvailable: 100,
      category: "Jewelery",
      imageUrl:
        "https://images.hugoboss.com/is/image/boss/hbna58137097_999_200?$re_fullPageZoom$&qlt=85&fit=crop,1&align=1,1&lastModified=1712757646000&wid=1200&hei=1818&fmt=webp",
    },
    {
      name: "GOLD-TONE NECKLACE WITH BRANDED LINK",
      price: 149.99,
      description:
        "A contemporary necklace by BOSS Jewelry. Featuring a subtle logo, this elegant accessory is crafted in gold-tone steel with bold elongated links.",
      qtyAvailable: 100,
      category: "Jewelery",
      imageUrl:
        "https://images.hugoboss.com/is/image/boss/hbna58137034_999_200?$re_fullPageZoom$&qlt=85&fit=crop,1&align=1,1&lastModified=1713473522000&wid=1200&hei=1818&fmt=webp",
    },
    {
      name: "SILVER-TONE BOX-CHAIN CUFF WITH GOLDEN LOGO PLATE",
      price: 119.0,
      description:
        "An elegant box-chain cuff by BOSS Jewelry. Crafted in stainless steel, this accessory features a magnetic closure with a gold-tone logo plate. Wrist circumference: 19cm Size: S",
      qtyAvailable: 100,
      category: "Jewelery",
      imageUrl:
        "https://images.hugoboss.com/is/image/boss/hbna58137002_999_200?$re_fullPageZoom$&qlt=85&fit=crop,1&align=1,1&lastModified=1713460133000&wid=1200&hei=1818&fmt=webp",
    },
    {
      name: "GOLD-TONE HOOP EARRINGS WITH ENGRAVED MONOGRAMS",
      price: 99.0,
      description:
        "Distinctive hoop earrings by BOSS Jewelry. Featuring engraved monograms, this signature pair is crafted in steel with a gold-tone finish. Length: 2.4cm",
      qtyAvailable: 100,
      category: "Jewelery",
      imageUrl:
        "https://images.hugoboss.com/is/image/boss/hbna58137109_999_200?$re_fullPageZoom$&qlt=85&fit=crop,1&align=1,1&lastModified=1713468607000&wid=1200&hei=1818&fmt=webp",
    },
    {
      name: "WD 2TB Elements Portable External Hard Drive - USB 3.0",
      price: 64,
      description:
        "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on hardware configuration and operating system",
      qtyAvailable: 100,
      category: "Electronics",
      imageUrl: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
    },
    {
      name: "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
      price: 109.0,
      description:
        "Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)",
      qtyAvailable: 100,
      category: "Electronics",
      imageUrl: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
    },
    {
      name: "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
      price: 109.0,
      description:
        "3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable faster bootup and improved overall system performance. The advanced SLC Cache Technology allows performance boost and longer lifespan 7mm slim design suitable for Ultrabooks and Ultra-slim notebooks. Supports TRIM command, Garbage Collection technology, RAID, and ECC (Error Checking & Correction) to provide the optimized performance and enhanced reliability.",
      qtyAvailable: 100,
      category: "Electronics",
      imageUrl: "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg",
    },
    {
      name: "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
      price: 114.0,
      description:
        "Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer's limited warranty",
      qtyAvailable: 100,
      category: "Electronics",
      imageUrl: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",
    },
    {
      name: "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
      price: 599.0,
      description:
        "21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No compatibility for VESA Mount Refresh Rate: 75Hz - Using HDMI port Zero-frame design | ultra-thin | 4ms response time | IPS panel Aspect ratio - 16: 9. Color Supported - 16. 7 million colors. Brightness - 250 nit Tilt angle -5 degree to 15 degree. Horizontal viewing angle-178 degree. Vertical viewing angle-178 degree 75 hertz",
      qtyAvailable: 100,
      category: "Electronics",
      imageUrl: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
    },
    {
      name: "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED",
      price: 999.99,
      description:
        "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY, HDR support and factory calibration provides stunningly realistic and accurate color and contrast 144HZ HIGH REFRESH RATE and 1ms ultra fast response time work to eliminate motion blur, ghosting, and reduce input lag",
      qtyAvailable: 100,
      category: "Electronics",
      imageUrl: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg",
    },
  ];

  for (const product of productsToSeed) {
    try {
      await addProduct(
        product.name,
        product.price,
        product.description,
        product.qtyAvailable,
        product.category,
        product.imageUrl
      );
      console.log(`Seeded: ${product.name}`);
    } catch (err) {
      console.error(`Error seeding ${product.name}: ${err.message}`);
    }
  }

  app.listen(3000, () => {
    console.log("The server is listening on port 3000!");
  });
}

init();
