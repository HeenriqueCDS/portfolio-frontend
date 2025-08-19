import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel, { EmblaCarouselType } from "embla-carousel-react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { ProjectImage } from "@/types/project";

interface ImageCarouselProps {
  images: ProjectImage[];
  className?: string;
  heightClass?: string; // Tailwind height utility, e.g., "h-80"
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  className,
  heightClass = "h-80",
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > 1 });
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const onSelect = useCallback((api: EmblaCarouselType | null) => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", () => onSelect(emblaApi));
  }, [emblaApi, onSelect]);

  if (!images || images.length === 0) return null;

  return (
    <div className={`relative w-full ${heightClass} ${className || ""}`}>
      <div className="overflow-hidden rounded-md bg-neutral-700 h-full" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((img, idx) => (
            <div key={`${img.url}-${idx}`} className="flex-[0_0_100%] min-w-0 relative h-full">
              <Image
                src={img.url}
                alt={img.alt || `Slide ${idx + 1}`}
                fill
                style={{ objectFit: "cover" }}
                unoptimized
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 text-white"
          >
            <CaretLeft size={20} weight="bold" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 text-white"
          >
            <CaretRight size={20} weight="bold" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i === selectedIndex ? "bg-green-400" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ImageCarousel;


