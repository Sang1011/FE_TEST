import * as React from "react";
import { Image } from "antd";
import { Col, Row, Button } from "antd";
import { Product } from "@/models";
import { DEFAULT_THUMBNAIL } from "@/constants/common";

export interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <>
      <Row
        align="middle"
        style={{
          border: "1px solid #D9D9D9",
          borderRadius: "8px",
          padding: "10px",
        }}
      >
        <Col
          span={6}
          style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
        >
          <Image
            width={131}
            src={product.thumbnail || DEFAULT_THUMBNAIL}
            alt={product.title || "Product image"}
            fallback={DEFAULT_THUMBNAIL}
          />
        </Col>
        <Col span={16}>
          <h2>{product.title}</h2>
          <p>{product.description} </p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <span style={{ marginRight: 30 }}>
                <b>{product.rating}</b> ⭐
              </span>
              <span
                style={{
                  textDecoration: "line-through",
                  color: "red",
                  marginRight: 8,
                }}
              >
                {product.price}
              </span>
              <span style={{ fontWeight: "bold", color: "green" }}>{product.discountPercentage}$</span>
            </div>
            <Button type="primary">Add to cart</Button>
          </div>
        </Col>
      </Row>
    </>
  );
}
