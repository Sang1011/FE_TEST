"use client";

import * as React from "react";
import { Col, Row, Input, Image } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

const { Search } = Input;

export function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("q") || "";
const [searchValue, setSearchValue] = React.useState(initialSearch);
  const [loading, setLoading] = React.useState(false);

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q"); 
    router.push(`/?${params.toString()}`);
  };
  

  const handleSearch = (value: string) => {
    if (value === searchParams.get("q")) return; 
  
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete("q");
    } else {
      params.set("q", value);
    }
    router.push(`/?${params.toString()}`);
  };
  
  

  React.useEffect(() => {
    if (!searchValue && searchParams.get("q")) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("q");
      router.push(`/?${params.toString()}`);
    }
  }, [searchValue]); 
  
  

  React.useEffect(() => {
    if (!searchValue) {
      setLoading(false);
      return;
    }
  
    setLoading(true);
    const delayDebounce = setTimeout(() => {
      handleSearch(searchValue);
      setLoading(false);
    }, 1000);
  
    return () => clearTimeout(delayDebounce);
  }, [searchValue]);
  

  return (
    <Row align="middle" style={{ marginBottom: "15px" }}>
      <Col
        span={6}
        style={{ display: "flex", justifyContent: "center", marginTop: 20 }}
      >
        <Image
          width={150}
          src="https://cehsoft.com/wp-content/uploads/2024/11/logo-ceh-new-02.png"
          alt="cehsoft logo"
        />
      </Col>
      <Col span={16} style={{ marginTop: 20 }}>
        <Search
          placeholder="Enter product's info(name/description)..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          allowClear
          onSearch={handleSearch}
          onClear={clearSearch}
          loading={loading}
        />
      </Col>
    </Row>
  );
}
