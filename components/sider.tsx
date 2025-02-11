"use client";

import * as React from "react";
import { Category } from "@/models/category";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export interface SiderProps {
  categories: Category[];
}

export function Sider({ categories: staticCategories }: SiderProps) {
  const [categories, setCategories] =
    React.useState<Category[]>(staticCategories);
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/categories`
        );
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div style={{ marginLeft: 15 }}>
      <h1>Categories</h1>
      <div style={{ marginLeft: 15 }}>
        {categories.map((category, index) => {
          const isActive = category.name === selectedCategory;

          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px 0",
              }}
            >
              <Link
                href={`?${new URLSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  category: category.name,
                })}`}
                style={{
                  textDecoration: "none",
                  color: isActive ? "#0067ff" : "black",
                  fontWeight: isActive ? "bold" : "normal",
                  fontSize: "16px",
                  flexGrow: 1,
                  padding: "5px 0"
                }}
              >
                {category.name}
              </Link>

              {isActive && (
                <Link
                  href={`?${new URLSearchParams(
                    Object.fromEntries(
                      [...searchParams.entries()].filter(
                        ([key]) => key !== "category"
                      )
                    )
                  )}`}
                  style={{
                    textDecoration: "none",
                    color: "#0067ff",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginLeft: 10,
                    fontSize: "18px",
                    marginRight: 20
                  }}
                >
                  ✖
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
