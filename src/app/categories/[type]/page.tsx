import CategoriesClientWrapper from './ClientWrapper';

export default async function CategoriesPage({ params }: { params: { type: string } }) {
  return <CategoriesClientWrapper type={params.type} />;
}
