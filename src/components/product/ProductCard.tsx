import { Link } from "react-router-dom";

type ProductCardProps = {
  id: number;
  code: string;
  persianName: string;
  englishName: string;
  price: string;
  image: string;
};

export function ProductCard({
  id,
  code,
  persianName,
  englishName,
  price,
  image,
}: ProductCardProps) {
  return (
    <Link
      to={`/products/${id}`}
      className="group block cursor-pointer overflow-hidden rounded-xl border bg-card transition hover:shadow-lg"
    >
      <div className="overflow-hidden">
        <img
          src={image}
          alt={persianName}
          className="h-72 w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="space-y-3 p-5">
        <div className="text-sm text-muted-foreground">کد محصول: {code}</div>

        <h3 className="text-xl font-semibold">{persianName}</h3>

        <p className="text-sm text-muted-foreground">{englishName}</p>

        <div className="pt-3">
          <span className="font-medium text-primary">{price}</span>
        </div>
      </div>
    </Link>
  );
}
