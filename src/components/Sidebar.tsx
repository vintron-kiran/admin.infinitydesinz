'use client';

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const menuConfig = [
  {
    title: "Dashboard",
    icon: "icon-home",
    link: "/dashboard",
  },
  {
    title: "Master Data",
    icon: "icon-layers",
    submenus: [
      { title: "Brands", link: "/brands", icon: "icon-tag" },
      { title: "Sizes", link: "/sizes", icon: "icon-size-actual" },
      { title: "Colors", link: "/colors", icon: "icon-drop" },
      { title: "Product Features", link: "/features", icon: "icon-star" },
      { title: "Product Filter", link: "/filter", icon: "icon-filter" },
    ],
  },
  {
    title: "Categories",
    icon: "icon-folder",
    submenus: [
     
      { title: "All Categories", link: "/categories-all", icon: "icon-folder-alt" },
      { title: "Main Category", link: "/categories/main", icon: "icon-folder-alt" },
      { title: "Sub Category", link: "/categories/sub-cat", icon: "icon-folder-alt" },
      { title: "List Sub Category", link: "/categories/list-sub-cat", icon: "icon-folder-alt" },
    ],
  },
  {
    title: "Home Page",
    icon: "icon-home",
    submenus: [
      { title: "Sliders", link: "/sliders", icon: "icon-picture" },
         { title: "SliderRight", link: "/slider-right", icon: "icon-picture" },
      { title: "Banner", link: "/banner", icon: "icon-picture" },
    ],
  },
  {
    title: "Promotions",
    icon: "icon-present",
     submenus: [
      { title: "Main Category Promotion", link: "/main-category-promotion", icon: "icon-picture" },
        { title: "Menu Category Promotion", link: "/menu-category-promotion", icon: "icon-picture" },
      
      { title: "Sub Menu Category Promotion", link: "/sub-menu-category-promotion", icon: "icon-picture" },
      
    ],
  },
  {
    title: "Products",
    icon: "icon-grid",
    submenus: [
      { title: "All Products", link: "/products", icon: "icon-grid" },
      { title: "Add Product", link: "/products/add", icon: "icon-plus" },
    ],
  },
  {
    title: "Change Password",
    icon: "icon-lock",
    link: "/change-password",
  },
];

export default function Sidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const openMap: { [key: string]: boolean } = {};
    menuConfig.forEach((item) => {
      if (item.submenus?.some((sub) => pathname.startsWith(sub.link))) {
        openMap[item.title] = true;
      }
    });
    setOpenMenus(openMap);
  }, [pathname]);

  const isActive = (link: string) => pathname === link;

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <aside className={`main-sidebar hidden-print ${collapsed ? 'collapsed' : ''}`}>
      <section className="sidebar">
        <ul className="sidebar-menu" style={{ paddingTop: 0 }}>
          {menuConfig.map((item) => {
            const hasSub = !!item.submenus;
            const menuOpen = openMenus[item.title];

            return (
              <li
                key={item.title}
                className={
                  hasSub
                    ? `treeview ${menuOpen ? "active menu-open" : ""}`
                    : isActive(item.link || "") ? "active" : ""
                }
              >
                <a
                  href={item.link || "#!"}
                  onClick={(e) => {
                    if (hasSub) {
                      e.preventDefault();
                      toggleMenu(item.title);
                    }
                  }}
                >
                  <i className={item.icon}></i> <span>{item.title}</span>
                  {hasSub && <i className="icon-arrow-down pull-right" />}
                </a>

                {hasSub && (
                  <ul className="treeview-menu" style={{ display: menuOpen ? "block" : "none" }}>
                    {item.submenus.map((sub) => (
                      <li key={sub.title} className={isActive(sub.link) ? "active" : ""}>
                        <a href={sub.link}>
                          <i className={sub.icon}></i> {sub.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </aside>
  );
}
