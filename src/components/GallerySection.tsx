import Image from "next/image";

const GallerySection = () => {
  return (
    <section className="bg-white py-16">
              <div className="container mx-auto px-4">
                <h3 className="text-2xl font-bold mb-8 text-center text-[#2f4f27]">Galería</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Image
                    src="/images/galeria_1.jpg"
                    alt="Galería 1"
                    width={350}
                    height={100}
                    className="rounded-lg shadow-md hover:shadow-xl transition duration-300"
                  />
                  <Image
                    src="/images/galeria_2.jpg"
                    alt="Galería 2"
                    width={350}
                    height={200}
                    className="rounded-lg shadow-md hover:shadow-xl transition duration-300"
                  />
                  <Image
                    src="/images/galeria_3.jpg"
                    alt="Galería 3"
                    width={350}
                    height={200}
                    className="rounded-lg shadow-md hover:shadow-xl transition duration-300"
                  />
                </div>
              </div>
            </section>
  );
};

export default GallerySection;
