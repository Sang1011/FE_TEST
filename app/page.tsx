import { Header, Sider } from "@/components";
import { ProductList } from "@/components/product";
import { Category } from "@/models";
import { Row, Col } from "antd";

async function fetchCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/categories`);
  const data = await res.json();
  return data;
}

export default async function Home() {
  const categories: Category[] = await fetchCategories();
  return (
    <>
      <Header/>
      <Row>
        <Col span={6}>
          <Sider categories={categories}/>
        </Col>

        <Col span={18}>
          <ProductList/>
        </Col>
      </Row>
    </>
  );
}
