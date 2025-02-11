"use client";

import * as React from "react";
import { ProductCard } from "./product-card";
import { Product } from "@/models";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Image, Spin } from "antd";
import { useSearchParams } from "next/navigation";
import { NO_DATA_FOUND_THUMBNAIL } from "@/constants/common";

const fetchProducts = async (pageParam = 0, query = "", category = "") => {
  let queryUrl = query
    ? `${process.env.NEXT_PUBLIC_API_URL}/products/search?q=${query}&limit=100`
    : null;
  let categoryUrl = category
    ? `${process.env.NEXT_PUBLIC_API_URL}/products/category/${category}?limit=100`
    : null;
    let defaultUrl = !query && !category
    ? `https://dummyjson.com/products?limit=100&skip=${pageParam}`
    : null;

  try {
    const [queryRes, categoryRes, defaultRes]: [{ products: Product[] }, { products: Product[] }, { products: Product[] }] = await Promise.all([
      queryUrl ? fetch(queryUrl).then((res) => res.json()) : Promise.resolve({ products: [] }),
      categoryUrl ? fetch(categoryUrl).then((res) => res.json()) : Promise.resolve({ products: [] }),
      defaultUrl ? fetch(defaultUrl).then((res) => res.json()) : Promise.resolve({ products: [] }),
    ]);

    let products: Product[] = [];

    if (query && category) {
      const querySet = new Set(queryRes.products.map((p: Product) => p.id));
      products = categoryRes.products.filter((p: Product) => querySet.has(p.id));
    } else {
      products = queryRes.products.length
        ? queryRes.products
        : categoryRes.products.length
        ? categoryRes.products
        : defaultRes.products;
    }

    const paginatedProducts = products.slice(pageParam, pageParam + 4);

    return {
      products: paginatedProducts,
      nextPage: paginatedProducts.length > 0 ? pageParam + 4 : undefined,
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return { products: [], nextPage: undefined };
  }
};



export function ProductList() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["products", query, category],
    queryFn: ({ pageParam }) => fetchProducts(pageParam, query, category),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.products.length > 0 ? lastPage.nextPage : undefined,
  });

  const combinedProducts = data?.pages.flatMap((page) => page.products) || [];

  const observerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    const currentRef = observerRef.current;
    observer.observe(currentRef);

    return () => observer.unobserve(currentRef);
  }, [fetchNextPage, hasNextPage]);

  const isEmpty = combinedProducts.length === 0;

  return (
    <div style={{ width: "89%" }}>
      {isEmpty ? (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Image
            width={300}
            src={NO_DATA_FOUND_THUMBNAIL}
            alt="No data found"
          />
          <p>No data found!</p>
        </div>
      ) : (
        combinedProducts.map((product) => (
          <React.Fragment key={product.id}>
            <ProductCard product={product} />
            <br />
          </React.Fragment>
        ))
      )}

      <div ref={observerRef} style={{ height: 40 }} />
      {isFetchingNextPage && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
}
