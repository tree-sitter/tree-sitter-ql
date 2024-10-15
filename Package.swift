// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterQL",
    products: [
        .library(name: "TreeSitterQL", targets: ["TreeSitterQL"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterQL",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterQLTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterQL",
            ],
            path: "bindings/swift/TreeSitterQLTests"
        )
    ],
    cLanguageStandard: .c11
)
